const express = require("express");
const app = express();
const PORT = process.env.PORT || 8000;
const mongoose = require("mongoose");
const { MONGOURL } = require("./confiq/keys");
mongoose.connect(MONGOURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

mongoose.connection.on("connected", () => {
  console.log("connected");
});

mongoose.connection.on("error", (err) => {
  console.log("error cannot connect due to ", err);
});

require("./models/user");
require("./models/posts")

app.use(express.json());
app.use(require("./routes/auth"));
app.use(require("./routes/posts"));
app.use(require("./routes/user"));



if(process.env.NODE_ENV=="production"){
  app.use(express.static('client/build'))
  const path = require('path')
  app.get("*",(req,res)=>{
      res.sendFile(path.resolve(__dirname,'client','build','index.html'))
  })
}

app.listen(PORT, () => {
  console.log("server is running on ", PORT);
});
