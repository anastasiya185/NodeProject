const express = require(`express`);
const app = express();
const db = require("mongoose");
const bodyParser = require("body-parser");
const adminMiddleware = require("./public/adminMiddleware");

const url =
  "mongodb+srv://anastasiya99:159789zxc@cluster0.ksi3h1m.mongodb.net/ProjectNodeJS";

db.connect(url)
  .then(() => {
    console.log("DB is on.");
  })
  .catch((err) => {
    console.log(err);
  });
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// קישרתי html
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index1.html");
});
app.get("/signup", (req, res) => {
  res.sendFile(__dirname + "/public/index2.html");
});

app.get("/buy", (req, res) => {
  res.sendFile(__dirname + "/public/index4.html");
});

app.get("/products", (req, res) => {
  res.sendFile(__dirname + "/public/index3.html");
});

//סכימה משתמשים
const userListSchema = db.Schema({
  name: String,
  email: String,

  password: String,
});
const userModel = db.model("userList", userListSchema);

//סכימה מוצרים
const productListSchema = db.Schema({
  name: String,
  price: Number,
});
const productModel = db.model("products", productListSchema);

//סכימה של קולקציה שלפה מוסיפים הזמנות מעמוד רביעי
const awaitingOrdersSchema = db.Schema({
  name: String,
  totalProducts: Number,
  totalPrice: Number,
});
const awaitingOrderModel = db.model("awaitingOrders", awaitingOrdersSchema);

const ordersSchema = db.Schema({
  email: String,
  cart: Array,
});
const orderModel = db.model("orders", ordersSchema);

//כל המשתמשים השמורים
app.get("/users", (req, res) => {
  let temp = [
    {
      name: "Anastasiya Bilida",
      email: "anastasiyabilida.99@gmail.com",
      password: "12345a",
    },
    {
      name: "Oshrat Oshrat",
      email: "oshratush1996@gmail.com",
      password: "12345b",
    },
    {
      name: "Eitan Leiberman",
      email: "eitan@svcollege.co.il",
      password: "12345c",
    },
  ];
  const users = async () => {
    await userModel.insertMany(temp);
    res.send("registered users");
  };
  users();
});

app.get("/products", (req, res) => {
  let temp = [
    {
      name: "chicken",
      price: 50,
    },
    {
      name: "rice",
      price: 10,
    },
    {
      name: "butter",
      price: 15,
    },
    {
      name: "cheese",
      price: 38,
    },
    {
      name: "eggs",
      price: 18,
    },
    {
      name: "milk",
      price: 8,
    },
    {
      name: "cheesecake",
      price: 64,
    },
  ];
  const products = async () => {
    await productModel.insertMany(temp);
    res.send("list of products");
  };
  products();
});

app.delete("/deleteall", async (req, res) => {
  await productModel.deleteMany({});
  res.send("ok");
});

app.get("/products1", async (req, res) => {
  const query = req.query.filter;
  products = [];
  if (query === undefined) products = await productModel.find({});
  else {
    products = await productModel
      .find({})
      .sort([[query, "ascending"]])
      .exec();
  }
  res.json(products);
});

app.post("/purchase", async (req, res) => {
  const { email, cart } = req.body;
  await orderModel.create({
    email: email,
    cart: cart,
  });
  res.send("ok");
});

app.get("/all", adminMiddleware, (req, res) => {
  res.sendFile(__dirname + "/public/index5.html");
});

app.get("/orders", adminMiddleware, async (req, res) => {
  let orders = await orderModel.find({});
  res.json(orders);
});

//פונקציה 1
//פונקציה שלוקחת את הנתונים שהמשתמש מכניס בעמוד ומשווה
//אותם לנתונים של משתמשים רשומים
app.post("/", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await userModel.findOne({ email, password });
    if (user) {
      console.log(user);
      res.json({ redirect: "/products1" });
    } else {
      res.json({ message: "Invalid credentials" });
    }
  } catch (error) {
    console.log(error);
  }
});

//html2
//פונקציה 2
// פונקציה ששומרת נתונים לקולקציה  של משתמשים השמורים
//ובודקת אימייך אם הוא כבר בקולקציה מראה שגיאה
app.post("/signup", async (req, res) => {
  let temp = {
    name: req.body.userName,
    email: req.body.emailSignUp,
    password: req.body.passwordSignUp,
  };
  try {
    const user = await userModel.findOne({ email: req.body.emailSignUp });
    if (user) {
      res.json({ message: "email already reqistered" });
    } else {
      console.log(temp);
      await userModel.insertMany(temp);
      res.json({ redirect: "/" });
    }
  } catch (error) {
    console.log(error);
  }
});

app.listen(3000, () => {
  console.log("server is on");
});
