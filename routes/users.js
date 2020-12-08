const uuid = require("uuid");
const userRoutes = (app, fs) => {
  // variables
  const dataPath = "./data/users.json";

  // helper methods
  const readFile = (
    callback,
    returnJson = false,
    filePath = dataPath,
    encoding = "utf8"
  ) => {
    fs.readFile(filePath, encoding, (err, data) => {
      if (err) {
        throw err;
      }

      callback(returnJson ? JSON.parse(data) : data);
    });
  };

  const writeFile = (
    fileData,
    callback,
    filePath = dataPath,
    encoding = "utf8"
  ) => {
    fs.writeFile(filePath, fileData, encoding, (err) => {
      if (err) {
        throw err;
      }

      callback();
    });
  };

  // READ
  app.get("/users", (req, res) => {
    fs.readFile(dataPath, "utf8", (err, data) => {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;

      if (err) {
        throw err;
      }

      const allUsers = JSON.parse(data);

      const result = {
        users: allUsers.slice((page - 1) * limit, page * limit),
        count: allUsers.length,
      };

      res.send(result);
    });
  });

  // READ
  app.get("/users/:id", (req, res) => {
    fs.readFile(dataPath, "utf8", (err, data) => {
      if (err) {
        throw err;
      }
      const userId = req.params["id"];
      res.send(findById(data, userId));
    });
  });

  function findIndexById(data, id) {
    return data.findIndex((a) => a.id.toString() === id);
  }

  function findById(data, id) {
    return JSON.parse(data).find((a) => a.id.toString() === id);
  }

  // CREATE
  app.post("/users", (req, res) => {
    readFile((data) => {
      req.body.id = uuid.v4();
      // add the new user
      data.push(req.body);

      writeFile(JSON.stringify(data, null, 2), () => {
        res.status(200).send("new user added");
      });
    }, true);
  });

  // UPDATE
  app.put("/users/:id", (req, res) => {
    readFile((data) => {
      // add the new user
      const userId = req.params["id"];
      const index = findIndexById(data, userId);

      data[index] = req.body;

      writeFile(JSON.stringify(data, null, 2), () => {
        res.status(200).send(`users id:${userId} updated`);
      });
    }, true);
  });

  // DELETE
  app.delete("/users/:id", (req, res) => {
    readFile((data) => {
      // add the new user
      const userId = req.params["id"];
      const index = findIndexById(data, userId);
      data.splice(index, 1);

      writeFile(JSON.stringify(data, null, 2), () => {
        res.status(200).send(`users id:${userId} removed`);
      });
    }, true);
  });
};

module.exports = userRoutes;
