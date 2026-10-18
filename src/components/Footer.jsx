import { Link } from "react-router-dom"; 
function Footer() {
   return ( 
      <footer className="footer">

         <div className="footer-container"> 

          {/* Brand / About */} 
          <div className="footer-section">
             <h2>Shopping Cart</h2> 
             <p> Your simple and reliable online shopping experience. </p>

             </div> {/* Quick Links */} 
             <div className="footer-section"> 
              <h3>Quick Links</h3>
               <ul>
                 <li> <Link to="/">Home</Link> </li>
                  <li> <Link to="/products">Products</Link> </li>
                   <li> <Link to="/orders">Orders</Link> </li> 
                   <li> <Link to="/cart"
                   >Cart</Link> </li>
                    </ul> 
                    </div> 
                    
                    {/* Customer Service */}
                     <div className="footer-section">
                       <h3>Customer Service</h3> 
                       <ul>
                          <li> <Link to="/login">Login</Link> </li>
                           <li> <Link to="/register">Register</Link> </li>
                           <li> <Link to="/about">About us</Link></li>
                            </ul> 
                            </div> 
                            
                            {/* Contact */} 
                            <div className="footer-section"> 
                              <h3>Contact</h3>
                               <p>Email: support@shoppingcart.com</p>
                                <p>Phone: +91 98765 43210</p>
                                 </div> 
                                 </div> 
                                 
                                 {/* Bottom Footer */} 
                                 <div className="footer-bottom"> 
                                  <p>© 2026 Shopping Cart. All rights reserved.</p> 
                                  </div> 
                                  </footer> 
                                  ); }
                                  
                                  export default Footer;