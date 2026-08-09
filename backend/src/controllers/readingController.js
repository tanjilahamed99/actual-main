const { default: mongoose } = require("mongoose");
const ReadingTest = require("../models/ReadingTest");
const User = require("../models/User");
const { readingTestPayloadSchema } = require("../validation/validation");

exports.createReadingTest = async (req, res) => {
  const parsed = readingTestPayloadSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      message: "Invalid payload",
      errors: parsed.error.flatten(),
    });
  }

  try {
    const exists = await ReadingTest.findOne({
      testNumber: parsed.data.testNumber,
    });
    if (exists) {
      return res.status(409).json({ message: "Test number already exists" });
    }

    const test = await ReadingTest.create(parsed.data);
    res.status(201).json(test);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to create reading test", error: err.message });
  }
};
exports.updateReadingTest = async (req, res) => {
  const parsed = readingTestPayloadSchema.partial().safeParse(req.body);
  if (!parsed.success) {
    return res
      .status(400)
      .json({ message: "Invalid payload", errors: parsed.error.flatten() });
  }
  const test = await ReadingTest.findOneAndUpdate(
    { testNumber: req.params.id },
    parsed.data,
    {
      new: true,
    },
  );
  if (!test) return res.status(404).json({ message: "Not found" });
  res.json(test);
};

exports.getAllReadingTests = async (req, res) => {
  const filter = {};
  if (req.query.status) filter.status = req.query.status;
  if (req.query.priority) filter.priority = req.query.priority;
  const tests = await ReadingTest.find(filter)
    .select("testNumber title priority status createdAt updatedAt")
    .sort({ testNumber: 1 });
  res.json(tests);
};

exports.getReadingTestById = async (req, res) => {
  const test = await ReadingTest.findOne({ testNumber: req.params.id });
  if (!test) return res.status(404).json({ message: "Not found" });
  res.json({ success: true, test });
};

// Public-facing — what your frontend fetches to render a live test
exports.getPublishedReadingTest = async (req, res) => {
  const test = await ReadingTest.findOne({
    testNumber: req.params.testNumber,
    status: "published",
  }).select("-answers"); // don't ship answer key to the client during the test
  if (!test) return res.status(404).json({ message: "Not found" });
  res.json(test);
};

exports.getAllPublishedReadingTest = async (req, res) => {
  const test = await ReadingTest.find(); // don't ship answer key to the client during the test
  if (!test) return res.status(404).json({ message: "Not found" });
  res.json({ test, success: true });
};

exports.deleteReadingTest = async (req, res) => {
  const test = await ReadingTest.findByIdAndDelete(req.params.id);
  if (!test) return res.status(404).json({ message: "Not found" });
  res.json({ message: "Deleted", success: true });
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password").lean();

    res.json({
      success: true,
      message: "Users Data",
      users,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateUserStatus = async (req, res) => {
  try {
    const { id, status } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid test ID format",
      });
    }

    const findUser = await User.findById(id);

    if (!findUser) {
      return res.status(301).send({
        success: false,
        message: "user not found",
      });
    }

    const mainStatus = ["pending", "approved", "rejected"];

    if (!mainStatus.includes(status)) {
      return res.status(401).send({
        success: false,
        message: "invalid data",
      });
    }

    const update = {
      $set: {
        status: status,
      },
    };

    const user = await User.findOneAndUpdate({ _id: id }, update);

    res.json({
      success: true,
      message: "User Data updated",
      user,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid test ID format",
      });
    }

    const findUser = await User.findById(id);

    if (!findUser) {
      return res.status(301).send({
        success: false,
        message: "user not found",
      });
    }

    const user = await User.findByIdAndDelete(id);

    res.json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
