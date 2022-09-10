async function pagination(req, res, models, option = {}) {
  let p = 1;
  let n = 3;
  if (req.query && req.query.p) {
    p = Number(req.query.p);
  }

  const total = await models.find().count().exec();

  if ((p - 1) * n < total) {
    const data = await models
      .find(option)
      .sort({ createAt: "desc" })
      .skip((p - 1) * n)
      .limit(n)
      .exec();

    res
      .status(200)
      .json({ data: data, message: "get data success", length: data.length });
  } else {
    res.status(400).json({ message: "cant find" });
  }
}
module.exports = pagination;