import React, { useContext, useState } from 'react'
import './ProductDisplay.css'
import star_icon from '../Assests/star_icon.png'
import star_dull_icon from '../Assests/star_dull_icon.png'
import { ShopContext } from '../../Context/ShopContext'
import emailjs from '@emailjs/browser';


const ProductDisplay = (props) => {
    const { product } = props;
    const { addToCart } = useContext(ShopContext);


    const [showBargainInput, setShowBargainInput] = useState(false);
    const [bargainPrice, setBargainPrice] = useState('');
    const [email, setEmail] = useState('');
    const toggleBargainInput = () => {
        setShowBargainInput(!showBargainInput);
    };

    const handleBargainSubmit = (e) => {
        e.preventDefault();
        console.log('Email:', email);
        console.log('Bargain Price:', bargainPrice);

        // Your EmailJS service ID, template ID, and Public Key
        const serviceId = 'service_69tgy7g';
        const templateId = 'template_lx9btxg';
        const publicKey = 'NFpiXuex4m08tTLaG';

        // Create a new object that contains dynamic template params
        const templateParams = {
            from_email: email,
            bargain_price: bargainPrice,
            product_name: product.name,
            to_name: 'Babar',
        };
        // Send the email using EmailJS
        emailjs.send(serviceId, templateId, templateParams, publicKey)
            .then((response) => {
                console.log('Email sent successfully!', response);
                setEmail('');
                setBargainPrice('');

            })
            .catch((error) => {
                console.error('Error sending email:', error);
            });
    };

    return (
        <div className='productdisplay'>
            <div className="productdisplay-left">
                <div className="productdisplay-img-list">
                    <img src={product.image} alt="" />
                    <img src={product.image} alt="" />
                    <img src={product.image} alt="" />
                    <img src={product.image} alt="" />
                </div>
                <div className="productdisplay-img">
                    <img className='productdisplay-main-img' src={product.image} alt="" />
                </div>
            </div>
            <div className="productdisplay-right">
                <h1>{product.name}</h1>
                <div className="productdisplay-right-star">
                    <img src={star_icon} alt="" />
                    <img src={star_icon} alt="" />
                    <img src={star_icon} alt="" />
                    <img src={star_icon} alt="" />
                    <img src={star_dull_icon} alt="" />
                    <p>(122)</p>
                </div>
                <div className="productdisplay-right-prices">
                    <div className="productdisplay-right-price-old">₹{product.old_price}</div>
                    <div className="producdisplay-right-price-new">₹{product.new_price}</div>
                </div>
                <div className="productdisplay-right-description">
                    A shirt, a timeless garment, seamlessly blends style and comfort. Crafted from quality fabrics, it features a versatile design suitable for various occasions. With a tailored fit and an array of colors and patterns, our shirts offer a perfect blend of sophistication and casual elegance, making them a wardrobe essential for any discerning individual.
                </div>
                <div className="productdisplay-right-size">
                    <h1>Select Size</h1>
                    <div className="productdisplay-right-sizes">
                        <div>S</div>
                        <div>M</div>
                        <div>L</div>
                        <div>XL</div>
                        <div>XXL</div>
                    </div>
                </div>
                <button onClick={() => { addToCart(product.id) }}>ADD TO CART </button>
                <button onClick={toggleBargainInput}>Bargain </button>
                {showBargainInput && (
                    <div className="productdisplay-bargain-input">
                        <form onSubmit={handleBargainSubmit} className='emailForm'>
                            <input
                                type="number"
                                placeholder="Enter Bargain Price"
                                value={bargainPrice}
                                onChange={(e) => setBargainPrice(e.target.value)}
                            />
                            <input className="email"
                                type="email"
                                placeholder="Your Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <button type="submit">Submit Bargain</button>
                        </form>
                    </div>
                )}

                <p className="productdisplay-right-category"><span>Category : </span>Women , T-Shirt , Crop Top</p>
                <p className="productdisplay-right-category"><span>Tags : </span>Modern , Latest</p>
            </div>
        </div>
    )
}

export default ProductDisplay
