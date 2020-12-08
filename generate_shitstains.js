const fs = require("fs");
const rw = require("random-words");
const dataPath = "./data/users.json";
const uuid = require("uuid");

fs.readFile(dataPath, "utf8", (err, data) => {
  const allUsers = JSON.parse(data);
  for (let i = 0; i < 400; i++) {
    allUsers.push({
      name: rw(),
      password: rw(),
      img_url:
        "https://i.pinimg.com/originals/34/79/4e/34794e23ba89942798ff911fc951df3a.jpg",
      id: uuid.v4(),
    });
  }
  fs.writeFile(dataPath, JSON.stringify(allUsers, null, 2), () => {
    console.log("new user added");
  });
});
