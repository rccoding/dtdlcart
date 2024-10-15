import React from 'react';
import { Link } from 'react-router-dom';
import Cart from '../cartUtils.js/cart';

const FirstPage = () => {
  return (
    <Cart/>
    // <div className="flex flex-col min-h-screen bg-gray-100">
    //   <header className="bg-blue-600 text-white py-4 text-center">
    //     <h1 className="text-4xl font-bold">Welcome To DTDL</h1>
    //   </header>

    //   <main className="flex-grow p-6">
    //     <section className="text-center mb-8">
    //       <h2 className="text-3xl font-semibold">Explore Our Services</h2>
    //       <p className="mt-2 text-lg">Stay connected with our reliable plans and services.</p>
    //     </section>

    //     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    //       <div className="bg-white p-6 rounded shadow">
    //         <h3 className="text-xl font-semibold">Recharge Plans</h3>
    //         <p className="mt-2">Explore our various recharge plans for prepaid and postpaid.</p>
    //         <Link to="/recharge" className="mt-4 inline-block bg-blue-500 text-white py-2 px-4 rounded">
    //           View Plans
    //         </Link>
    //       </div>

    //       <div className="bg-white p-6 rounded shadow">
    //         <h3 className="text-xl font-semibold">Device Upgrades</h3>
    //         <p className="mt-2">Upgrade your device with the latest models and offers.</p>
    //         <Link to="/devices" className="mt-4 inline-block bg-blue-500 text-white py-2 px-4 rounded">
    //           Shop Now
    //         </Link>
    //       </div>

    //       <div className="bg-white p-6 rounded shadow">
    //         <h3 className="text-xl font-semibold">Customer Support</h3>
    //         <p className="mt-2">Need help? Our customer support is here for you.</p>
    //         <Link to="/support" className="mt-4 inline-block bg-blue-500 text-white py-2 px-4 rounded">
    //           Get Support
    //         </Link>
    //       </div>
    //     </div>
    //   </main>

    //   <footer className="bg-blue-600 text-white py-4 text-center">
    //     <p>© 2024 Telecom. All rights reserved.</p>
    //   </footer>
    // </div>
  );
};

export default FirstPage;