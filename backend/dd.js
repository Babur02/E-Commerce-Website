const port = 4000;
const express = require('express');
const cors = require('cors');
const crypto = require('crypto');
const axios = require('axios');
const app = express();
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

// Database Connection with MongoDB
mongoose.connect('mongodb+srv://chiranjib:7076406356@cluster0.xfdbgq6.mongodb.net/e-commerce', { useNewUrlParser: true, useUnifiedTopology: true });

// API creation
app.get("/", (req, res) => {
  res.send("Express App is Running");
});

const salt_key = '099eb0cd-02cf-4e2a-8aca-3e6c6aff0399';
const merchant_id = 'PGTESTPAYUAT';

app.post('/order', async (req, res) => {
  try {
    const merchantTransactionId = req.body.transactionId;
    const data = {
      merchantId: merchant_id,
      merchantTransactionId,
      name: req.body.name,
      amount: req.body.amount * 100,
      redirectUrl: `http://localhost:3000/status?id=${merchantTransactionId}`,
      redirectMode: "POST",
      mobileNumber: req.body.phone,
      paymentInstrument: {
        type: "PAY_PAGE"
      }
    };
    const payload = JSON.stringify(data);
    const payloadMain = Buffer.from(payload).toString('base64');
    const string = `${payloadMain}/pg/v1/pay${salt_key}`;
    const sha256 = crypto.createHash('sha256').update(string).digest('hex');
    const checksum = `${sha256}###${1}`;
    const prod_URL = "https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/pay";
    const options = {
      method: 'POST',
      url: prod_URL,
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/json',
        'X-VERIFY': checksum
      },
      data: {
        request: payloadMain
      }
    };
    await axios(options).then((response) => {
      console.log(response.data);
      return res.json(response.data);
    }).catch((error) => {
      console.log(error);
    });
  } catch (error) {
    console.log(error);
  }
});

// Image Storage Engine
const storage = multer.diskStorage({
  destination: './upload/images',
  filename: (req, file, cb) => {
    return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`);
  }
});
const upload = multer({ storage: storage });

// Creating Upload Endpoint for images
app.use('/images', express.static('upload/images'));

app.post('/upload', upload.single('product'), async (req, res) => {
  res.json({
    success: 1,
    image_url: `http://localhost:${port}/images/${req.file.filename}`
  });
});

// schema for Creating products
const Product = mongoose.model("Product", {
  id: {
    type: Number,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  new_price: {
    type: Number,
    required: true
  },
  old_price: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  available: {
    type: Boolean,
    default: true
  }
});

app.post("/addproduct", async (req, res) => {
  try {
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
      id,
      name: req.body.name,
      image: req.body.image,
      category: req.body.category,
      new_price: req.body.new_price,
      old_price: req.body.old_price
    });
    await product.save();
    res.json({
      success: true,
      name: req.body.name
    });
  } catch (error) {
    console.log(error);
  }
});

// creating API for deleting Products
app.post('/removeproduct', async (req, res) => {
  try {
    await Product.findOneAndDelete({ id: req.body.id });
    res.json({
      success: true,
      name: req.body.name
    });
  } catch (error) {
    console.log(error);
  }
});

// creating API for getting all products
app.get('/allproducts', async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (error) {
    console.log(error);
  }
});

// creating API for getting popular products in women
app.get('/popularinwomen', async (req, res.name
    });
  }) => {
  try {
    const products catch (error) {
    console.log = await Product.find(error);
  }
});

// creating({ category: 'women' });
    API for getting all res products
app.get.json(('/allproducts', async (req, res) => {products);
  } catch (error) {
  try {

    console.log(error);
     const products = await Product.find({});
    res }
});

// creating API for getting new collections
app.get.json(('/newcollections', async (req, res) => {products);
  } catch (error) {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (error) {
    console.log
    console.log(error);
 (error);
  }
});

// schema }
});

// creating API for getting for creating users popular products in women
const User = mongoose.model("User", {
  id
app.get('/popularinwomen', async (req, res: {
    type: Number,
    required: true
  },
  name: {
) => {
  try {
    const products = await Product.find    type: String,
    required: true({ category: "
  },
  email: {
    type: String,
   women" });
    res.json( required: true
  },
  password: {
    type: String,
   products);
  } catch (error) {
    console.log(error);
  required: true
  },
  date: {
    type: Date,
    }
});

// creating API for getting new collections default: Date.now
  },
  cart: {
    type
app.get('/newcollections', async (req, res) => {
  try {: Array,
    default: []
  }
});

//
    const products = await Product.find({});
    res creating API for adding products to.json(products);
  } catch (error) {
    console.log cart
app.post('/addtocart', async (req, res) => {
  try {(error);
  }
});

// schema for creating users
const
    const user = await User.findOne({ email User = mongoose.model("User: req.body.email });
    if (user) {
      const", {
  id: {
    type: Number,
    required: true
  },
  name: {
 product = await Product.findOne({ id: req.body.    type: String,
    required: true
  },
 id });
      if (product) {
 email: {
    type: String,
    required: true
         const index = user.cart.findIndex(p },
  password: {
    type: String,
    required: true
  },
  date: {
    type => p.id === product.id);
        if: Date,
    default: Date.now
  },
  cart: {
    type (index === -1) {
          user.cart.push({ id: product.id, name: product.name,: Array,
    default: []
  }
});

// creating API for adding image: product.image, new_price: product.new_price, quantity:  products to cart
app.post('/addtocart', async (req, res) => {
  try {
    const user1 });
        } else {
          user.cart[index].quantity += 1;
        }
        await user.save();
        res.json({
          success: true, = await User.findOne({ email: req.body.email });
    if (user) {
      const product
          name: product.name
        });
      } else {
        res.json({
          = await Product.findOne({ id: req.body.id });
      if (product) {
        const success: false,
          message: "Product not found"
        });
      }
    } else {
      res. index = user.cart.findIndex(p => p.id === product.id);
        if (index ===json({
        success: false,
        message: "User not found"
      });
    }
  } catch (error) {
    console.log(error);
  }
});

// creating API -1) {
          user.cart.push({ id: product.id, name: product.name, image for removing products from cart
app.post('/removefromcart', async (req: product.image, new_price: product.new, res) => {_price, quantity: 1 });
        } else {
          user
  try {
    const user = await User.findOne({ email: req.body.email });
    if.cart[index].quantity += 1;
        (user) {
      const product = await Product.findOne({ id: req.body.id });
      if (product) {
        const }
        await user.save();
        res.json({
 index = user.cart.findIndex(p => p.id ===          success: true,
          name: product.name
 product.id);
        if (index !== -1) {
        });
      } else {
        res.json({
                   user.cart.splice(index,  success: false,
          message: "Product not found"
        });
      }
1);
          await    } else {
      res.json({
        success user.save: false,
        message: "User not found"
     ();
          res.json({
            success: true,
            name: product });
    }
  } catch (error) {
    console.log(error);
  }
});.name
          });
        } else

// creating API for removing products from {
          res.json({
            success: false,
            message: "Product not cart
app.post('/removefromcart', async (req, res) => {
  try {
    const user found in cart"
          });
        }
      } else = await User.findOne({ email: req.body.email });
    if (user) {
 {
        res.json({
          success: false,
          message: "Product not      const product = await Product.findOne({ id: req.body.id });
      if (product) {
        const index = user.cart.findIndex(p => p.id === found"
        });
      }
    } else {
      res.json({
        success: false,
        message: "User not found"
      });
    }
 product.id);
        if (index !== -1) {
          user.cart.splice(index, 1);
          await user.save  } catch (error) {
    console.log(error);
  }
});

// creating API for getting cart items
app.post('/getcart', async (req,();
          res.json({
            success: true,
            name: product.name
          });
        } else {
          res.json({
            success: false,
 res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
            message: "Product not found in cart"
          });
        }
      } else {
        res.json({
          success: false,
          message: "Product not found"
        });
      }
      const products    } else {
      res.json({
        success: false,
        message: "User not found"
      = await Product.find({ id: { $in: user });
    }
  } catch (error) {
    console.log(error);
  }
});

// creating API for getting cart items
app.post('/getcart', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      res.json(user.cart);
    } else {
     res.json({
        success: false,
        message: "User not found"
      });
    }
  } catch (error) {
    console.log(error);
  }
});

// creating API for creating users
app.post('/signup', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      res.json({
        success: false,
        message: "User already exists"
      });
    } else {
      const newUser = new User({
        id: Date.now(),
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
      });
      await newUser.save();
      res.json({
        success: true,
        message: "User created successfully"
      });
    }
  } catch (error) {
    console.log(error);
  }
});

// creating API for user login
app.post('/login', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      if (user.password === req.body.password) {
        const token = jwt.sign({ id: user.id, email: user.email }, 'secret_key', { expiresIn: '1h' });
        res.json({
          success: true,
          message: "Login successful",
          token
        });
      } else {
        res.json({
          success: false,
          message: "Invalid password"
        });
      }
    } else {
      res.json({
        success: false,
        message: "User not found"
      });
    }
  } catch (error) {
    console.log(error);
  }
});

// creating API for user logout
app.post('/logout', async (req, res) => {
  try {
    res.json({
      success: true,
      message: "Logout successful"
    });
  } catch (error) {
    console.log(error);
  }
});

// creating API for getting user details
app.get('/user', async (req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, 'secret_key');
    const user = await User.findOne({ email: decoded.email });
    if (user) {
      res.json(user);
    } else {
      res.json({
        success: false,
        message: "User not found"
      });
    }
  } catch (error) {
    console.log(error);
  }
});

// creating API for updating user details
app.put('/user', async (req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, 'secret_key');
    const user = await User.findOneAndUpdate({ email: decoded.email }, req.body, { new: true });
    if (user) {
      res.json(user);
    } else {
      res.json({
        success: false,
        message: "User not found"
      });
    }
  } catch (error) {
    console.log(error);
  }
});

// creating API for deleting user
app.delete('/user', async (req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, 'secret_key');
    const user = await User.findOneAndDelete({ email: decoded.email });
    if (user) {
      res.json({
        success: true,
        message: "User deleted successfully"
      });
    } else {
      res.json({
        success: false,
        message: "User not found"
      });
    }
  } catch (error) {
    console.log(error);
  }
});

// creating API for getting all products
app.get('/products', async (req, res)=> {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (error) {
    console.log(error);
  }
});

// creating API for getting product details
app.get('/product/:id', async (req, res) => {
  try {
    const product = await Product.findOne({ id: req.params.id });
    if (product) {
      res.json(product);
    } else {
      res.json({
        success: false,
        message: "Product not found"
      });
    }
  } catch (error) {
    console.log(error);
  }
});

// creating API for updating product details
app.put('/product/:id', async (req, res) => {
  try {
    const product = await Product.findOneAndUpdate({ id: req.params.id }, req.body, { new: true });
    if (product) {
      res.json(product);
    } else {
      res.json({
        success: false,
        message: "Product not found"
      });
    }
  } catch (error) {
    console.log(error);
  }
});

// creating API for deleting product
app.delete('/product/:id', async (req, res) => {
  try {
    const product = await Product.findOneAndDelete({ id: req.params.id });
    if (product) {
      res.json({
        success: true,
        message: "Product deleted successfully"
      });
    } else {
      res.json({
        success: false,
        message: "Product not found"
      });
    }
  } catch (error) {
    console.log(error);
  }
});

// creating API for adding product to wishlist
app.post('/wishlist', async (req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, 'secret_key');
    const user = await User.findOne({ email: decoded.email });
    if (user) {
      const product = await Product.findOne({ id: req.body.id });
      if (product) {
        const index = user.wishlist.findIndex(p => p.id === product.id);
        if (index === -1) {
          user.wishlist.push(product);
        } else {
          user.wishlist.splice(index, 1);
        }
        await user.save();
        res.json({
          success: true,
          message: "Product added to wishlist"
        });
      } else {
        res.json({
          success: false,
          message: "Product not found"
        });
      }
    } else {
      res.json({
        success: false,
        message: "User not found"
      });
    }
  } catch (error) {
    console.log(error);
  }
});

// creating API for getting wishlist items
app.get('/wishlist', async (req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, 'secret_key');
    const user = await User.findOne({ email: decoded.email });
    if (user) {
      res.json(user.wishlist);
    } else {
      res.json({
        success: false,
        message: "User not found"
      });
    }
  } catch (error) {
    console.log(error);
  }
});

// creating API for removing product from wishlist
app.delete('/wishlist/:id', async (req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, 'secret_key');
    const user = await User.findOne({ email: decoded.email });
    if (user) {
      const product = await Product.findOne({ id: req.params.id });
      if (product) {
        const index = user.wishlist.findIndex(p => p.id === product.id);
        if (index !== -1) {
          user.wishlist.splice(index, 1);
          await user.save();
          res.json({
            success: true,
            message: "Product removed from wishlist"
          });
        } else {
          res.json({
            success: false,
            message: "Product not found in wishlist"
          });
        }
      } else {
        res.json({
          success: false,
          message: "Product not found"
        });
      }
    } else {
      res.json({
        success: false,
        message: "User not found"
      });
    }
  } catch (error) {
    console.log(error);
  }
});

// creating API for adding product to cart
app.post('/cart', async (req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, 'secret_key');
    const user = await User.findOne({ email: decoded.email });
    if (user) {
      const product = await Product.findOne({ id: req.body.id });
      if (product) {
        const index = user.cart.findIndex(p => p.id === product.id);
        if (index === -1) {
          user.cart.push({ id: product.id, name: product.name, image: product.image, new_price: product.new_price, quantity: 1 });
        } else {
          user.cart[index].quantity += 1;
        }
        await user.save();
        res.json({
          success: true,
          message: "Product added to cart"
        });
      } else {
        res.json({
          success: false,
          message: "Product not found"
        });
      }
    } else {
      res.json({
        success: false,
        message: "User not found"
      });
    }
  } catch (error) {
    console.log(error);
  }
});

// creating API for getting cart items
app.get('/cart', async (req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, 'secret_key');
    const user = await User.findOne({ email: decoded.email });
    if (user) {
      res.json(user.cart);
    } else {
      res.json({
        success: false,
        message: "User not found"
      });
    }
  } catch (error) {
    console.log(error);
  }
});

// creating API for removing product from cart
app.delete('/cart/:id', async (req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, 'secret_key');
    const user = await User.findOne({ email: decoded.email });
    if (user) {
      const product = await Product.findOne({ id: req.params.id });
      if (product) {
        const index = user.cart.findIndex(p => p.id === product.id);
        if (index !== -1) {
          user.cart.splice(index, 1);
          await user.save();
          res.json({
            success: true,
            message: "Product removed from cart"
          });
        } else {
          res.json({
            success: false,
            message: "Product not found in cart"
          });
        }
      } else {
        res.json({
          success: false,
          message: "Product not found"
        });
      }
    } else {
      res.json({
        success: false,
        message: "User not found"
      });
    }
  } catch (error) {
    console.log(error);
  }
});

// creating API for updating product quantity in cart
app.put('/cart/:id', async (req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, 'secret_key');
    const user = await User.findOne({ email: decoded.email });
    if (user) {
      const product = await Product.findOne({ id: req.params.id });
      if (product) {
        const index = user.cart.findIndex(p => p.id === product.id);
        if (index !== -1) {
          user.cart[index].quantity = req.body.quantity;
          await user.save();
          res.json({
            success: true,
            message: "Product quantity updated in cart"
          });
        } else {
          res.json({
            success: false,
            message: "Product not found in cart"
          });
        }
      } else {
        res.json({
          success: false,
          message: "Product not found"
        });
      }
    } else {
      res.json({
        success: false,
        message: "User not found"
      });
    }
  } catch (error) {
    console.log(error);
  }
});

// creating API for getting order details
app.get('/order/:id', async (req, res) => {
  try {
    const order = await Order.findOne({ id: req.params.id });
    if (order) {
      res.json(order);
    } else {
      res.json({
        success: false,
        message: "Order not found"
      });
    }
  } catch (error) {
    console.log(error);
  }
});

// creating API for creating order
app.post('/order', async (req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, 'secret_key');
    const user = await User.findOne({ email: decoded.email });
    if (user) {
      const order = new Order({
        id: Date.now(),
        userId: user.id,
        items: user.cart,
        total: user.cart.reduce((acc, item) => acc + item.new_price * item.quantity, 0),
        date: new Date()
      });
      await order.save();
      user.cart = [];
      await user.save();
      res.json({
        success: true,
        message: "Order placed successfully",
        order
      });
    } else {
      res.json({
        success: false,
        message: "User not found"
      });
    }
  } catch (error) {
    console.log(error);
  }
});

// creating API for getting all orders
app.get('/orders', async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.query.userId });
    res.json(orders);
  } catch (error) {
    console.log(error);
  }
});

// creating API for getting all orders
app.get('/orders', async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.query.userId });
    res.json(orders);
  } catch (error) {
    console.log(error);
  }
});

// creating API for getting all orders
app.get('/orders', async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.query.userId });
    res.json(orders);
  } catch (error) {
    console.log(error);
  }
});

// creating API for getting all orders
app.get('/orders', async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.query.userId });
    res.json(orders);
  } catch (error) {
    console.log(error);
  }
});

// creating API for getting all orders
app.get('/orders', async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.query.userId });
    res.json(orders);
  } catch (error) {