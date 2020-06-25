const { Order, CartItem } = require("../models/order");
const { errorHandler } = require("../helpers/dbErrorHandler");
// sendgrid for email npm i @sendgrid/mail
const nodemailer = require("nodemailer");
exports.orderById = (req, res, next, id) => {
  Order.findById(id)
    .populate("products.product", "name price")
    .exec((err, order) => {
      if (err || !order) {
        return res.status(400).json({
          error: errorHandler(err)
        });
      }
      req.order = order;
      next();
    });
};

exports.create = (req, res) => {
  console.log("CREATE ORDER: ", req.body);
  req.body.order.user = req.profile;
  const order = new Order(req.body.order);
  order.save((error, data) => {
    if (error) {
      return res.status(400).json({
        error: errorHandler(error)
      });
    }
    // send email alert to admin
    // order.address
    // order.products.length
    // order.amount
    // const emailData = {
    //   to: "udaykiranravva123@gmail.com",
    //   from: "noreply@ecommerce.com",
    //   subject: `A new order is received`,
    //   html: `
    //         <p>Customer name:</p>
    //         <p>Total products: ${order.products.length}</p>
    //         <p>Total cost: ${order.amount}</p>
    //         <p>Login to dashboard to the order in detail.</p>
    //     `
    // };
    // sgMail.send(emailData);
    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD
      }
    });

    var mailOptions = {
      from: process.env.EMAIL,
      to: order.user.email,
      subject: `You order is in process`,
      html: `
            <h1>Hey ${req.profile.name}, Thank you for shopping with us.</h1>
            <h2>Total products: ${order.products.length}</h2>
            <h2>Transaction ID: ${order.transaction_id}</h2>
            <h2>Order status: ${order.status}</h2>
            <h2>Product details:</h2>
            <hr />
            ${order.products
              .map((p) => {
                return `<div>
                        <h3>Product Name: ${p.name}</h3>
                        <h3>Product Price: ${p.price}</h3>
                        <h3>Product Quantity: ${p.count}</h3>
                </div>`;
              })
              .join("--------------------")}
            <h2>Total order cost: ${order.amount}<h2>
            <p>Thank your for shopping with us.</p>
        `
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email Sent: " + info.response);
      }
    });
    res.json(data);
  });
};

exports.listOrders = (req, res) => {
  Order.find()
    .populate("user", "_id name address")
    .sort("-created")
    .exec((err, orders) => {
      if (err) {
        return res.status(400).json({
          error: errorHandler(error)
        });
      }
      res.json(orders);
    });
};

exports.getStatusValues = (req, res) => {
  res.json(Order.schema.path("status").enumValues);
};

exports.updateOrderStatus = (req, res) => {
  Order.update(
    { _id: req.body.orderId },
    { $set: { status: req.body.status } },
    (err, order) => {
      if (err) {
        return res.status(400).json({
          error: errorHandler(err)
        });
      }
      res.json(order);
    }
  );
};
