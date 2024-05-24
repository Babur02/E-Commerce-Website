const axios = require("axios");
require("dotenv").config();
// const { app } = require("./app.js");
const Razorpay = require("razorpay");
const port = 4000;
const express = require("express");
const cors = require("cors");
const crypto = require("crypto");
const app = express();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const { strict } = require("assert");
const { nextTick } = require("process");
const stripe = require("stripe")(
  "sk_test_51P9mVoSGAwfzaSvRajr2A2pKhvPBpHEcqsZuicy8J4R4aqaXylXZ7E5DjgkQu8y73LkXgQ3BqtmlNbv4sia3Y60X00wBeDZwUi"
);
const uuid = require("uuid");
// const sendMail = require("./controller/sendMail");
// app.get("/mail", sendMail);

app.use(express.json());
app.use(cors());
// app.use(express.urlencoded({ extended: true }));
// // Payment gateway
app.post("/payment", (req, res) => {
  const { product, token } = req.body;
  console.log("PRODUCT", product);
  console.log("PRICE", product.price);
  const idempontencyKey = uuid();

  return stripe.customers
    .create({
      email: token.email,
      source: token.id,
    })
    .then((customer) => {
      stripe.charges.create(
        {
          amount: product.price * 100,
          currency: "inr",
          customer: customer.id,
          receipt_email: token.email,
          description: `purchase of ₹{product.name}`,
          shipping: {
            name: token.card.name,
            address: {
              country: token.card.address_country,
            },
          },
        },
        { idempontencyKey }
      );
    })
    .then((result) => res.status(200).json(result))
    .catch((err) => console.log(err));
});

// Database Connection with MongoDB

mongoose.connect(
  "mongodb+srv://chiranjib:7076406356@cluster0.xfdbgq6.mongodb.net/e-commerce"
);

//API creation

app.get("/", (req, res) => {
  res.send("Express App is Running");
});

// app.post('/order', async (req, res) => {
//     try {
//       const merchantTransactionId = req.body.transactionId;
//       const data = {
//         merchantId: merchant_id,
//         merchantTransactionId,
//         name: req.body.name,
//         amount: req.body.amount * 100,
//         redirectUrl: `http://localhost:3000/status?id=${merchantTransactionId}`,
//         redirectMode: "POST",
//         mobileNumber: req.body.phone,
//         paymentInstrument: {
//           type: "PAY_PAGE"
//         }
//       };
//       const payload = JSON.stringify(data);
//       const payloadMain = Buffer.from(payload).toString('base64');
//       const keyIndex = 1
//       const string = payloadMain +'/pg/v1/pay'+ salt_key;
//       const sha256 = crypto.createHash('sha256').update(string).digest('hex');
//       const checksum = sha256 +'###'+ 1;
//       const prod_URL = "https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/pay";
//       const options = {
//         method: 'POST',
//         url: prod_URL,
//         headers: {
//           accept: 'application/json',
//           'Content-Type': 'application/json',
//           'X-VERIFY': checksum
//         },
//         data: {
//           request: payloadMain
//         }
//       };
//       await axios(options).then((response) => {
//         console.log(response.data);
//         return res.json(response.data);
//       }).catch((error) => {
//         console.log(error);
//       });
//     } catch (error) {
//       console.log(error);
//     }
//   });

//Image Storage Engine

const storage = multer.diskStorage({
  destination: "./upload/images",
  filename: (req, file, cb) => {
    return cb(
      null,
      `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`
    );
  },
});
const upload = multer({ storage: storage });

// Creating Upload Endpoint for images
app.use("/images", express.static("upload/images"));

app.post("/upload", upload.single("product"), (req, res) => {
  res.json({
    success: 1,
    image_url: `http://localhost:${port}/images/${req.file.filename}`,
  });
});

// schema for Creating products

const Product = mongoose.model("Product", {
  id: {
    type: Number,
    require: true,
  },
  name: {
    type: String,
    require: true,
  },
  image: {
    type: String,
    require: true,
  },
  category: {
    type: String,
    require: true,
  },
  new_price: {
    type: Number,
    require: true,
  },
  old_price: {
    type: Number,
    require: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  available: {
    type: Boolean,
    default: true,
  },
});

app.post("/addproduct", async (req, res) => {
  let products = await Product.find({});
  let id;
  if (products.length > 0) {
    let last_product_array = products.slice(-1);
    let last_product = last_product_array[0];
    id = last_product.id + 1;
  } else {
    id = 1;
  }

  const product = new Product({
    id: id,
    name: req.body.name,
    image: req.body.image,
    category: req.body.category,
    new_price: req.body.new_price,
    old_price: req.body.old_price,
  });
  console.log(product);
  await product.save();
  console.log("save");
  res.json({
    success: true,
    name: req.body.name,
  });
});

// creating API for deleting Products
app.post("/removeproduct", async (req, res) => {
  await Product.findOneAndDelete({ id: req.body.id });
  console.log("Remove");
  res.json({
    success: true,
    name: req.body.name,
  });
});

// Creating API for getting all products
app.get("/allproducts", async (req, res) => {
  let products = await Product.find({});
  console.log("All Products Fetched");
  res.send(products);
});

// schema creating for user model
const Users = mongoose.model("Users", {
  name: {
    type: String,
  },
  email: {
    type: String,
    unique: true,
  },
  password: {
    type: String,
  },
  cartData: {
    type: Object,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

// creating end point for registering the user

app.post("/signup", async (req, res) => {
  let check = await Users.findOne({ email: req.body.email });
  if (check) {
    return res
      .status(400)
      .json({
        success: false,
        error: "existing user found with same email address",
      });
  }
  let cart = {};
  for (let i = 0; i < 300; i++) {
    cart[i] = 0;
  }
  const user = new Users({
    name: req.body.username,
    email: req.body.email,
    password: req.body.password,
    cartData: cart,
  });

  await user.save();

  const data = {
    user: {
      id: user.id,
    },
  };
  const token = jwt.sign(data, "secret_ecom");
  res.json({ success: true, token });
});
// creating endpoint user login
app.post("/login", async (req, res) => {
  let user = await Users.findOne({ email: req.body.email });
  if (user) {
    const passCompare = req.body.password === user.password;
    if (passCompare) {
      const data = {
        user: {
          id: user.id,
        },
      };
      const token = jwt.sign(data, "secret_ecom");
      res.json({ success: true, token });
    } else {
      res.json({ success: false, errors: "wrong Password" });
    }
  } else {
    res.json({ success: false, errors: "wrong email id" });
  }
});

// creating endpoint for newcollection
app.get("/newcollections", async (req, res) => {
  let products = await Product.find({});
  let newcollection = products.slice(1).slice(-8);
  console.log("NewCollection fecthed");
  res.send(newcollection);
});

//creating endpoint for popular in women section
app.get("/popularinwomen", async (req, res) => {
  let products = await Product.find({ category: "women" });
  let popular_in_women = products.slice(0, 4);
  console.log("Popular in women fetched");
  res.send(popular_in_women);
});
//creating middleware to fetch user
const fetchUser = async (req, res, next) => {
  const token = req.header("auth-token");
  if (!token) {
    res.status(401).send({ errors: "Please authenticate using valid token" });
  } else {
    try {
      const data = jwt.verify(token, "secret_ecom");
      req.user = data.user;
      next();
    } catch (error) {
      res.status(401).send({ errors: "please authenticate using valid token" });
    }
  }
};

//creating endpoint for adding products in cartdata
app.post("/addtocart", fetchUser, async (req, res) => {
  console.log("Added", req.body.itemId);
  let userData = await Users.findOne({ _id: req.user.id });
  userData.cartData[req.body.itemId] += 1;
  await Users.findOneAndUpdate(
    { _id: req.user.id },
    { cartData: userData.cartData }
  );
  res.send("Added");
});
// creating endpoint to remove product from cartdata
app.post("/removefromcart", fetchUser, async (req, res) => {
  console.log("remove", req.body.itemId);
  let userData = await Users.findOne({ _id: req.user.id });
  if (userData.cartData[req.body.itemId] > 0) {
    userData.cartData[req.body.itemId] -= 1;
  }

  await Users.findOneAndUpdate(
    { _id: req.user.id },
    { cartData: userData.cartData }
  );
  res.send("Removed");
});

//creating endpoint to get cartitem
app.post("/getcart", fetchUser, async (req, res) => {
  console.log("GetCart");
  let userData = await Users.findOne({ _id: req.user.id });
  res.json(userData.cartData);
});

app.listen(port, (error) => {
  if (!error) {
    console.log("server running on port " + port);
  } else {
    console.log("Error : " + error);
  }
});
