// Imports
require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const bodyParser = require("body-parser");
const multer = require("multer");
const nodemailer = require("nodemailer");
const path = require("path");

const MongoStore = require("connect-mongo");

// Model Imports
const [
  Logo,
  SEOContent,
  SEOImage,
  ServiceCard,
  DynamicContent,
  CompanyContent,
  ValuesImage,
  HistoryImage,
  VisionImage,
  ServiceDetail,
  ServiceCategory,
  RegionOneImage,
  CompanyCount,
  Banner,
  EmployeeSchema,
  TeamSchema,
  User,
  StoreSection,
  TeamSection
] = [
  "./models/Logo",
  "./models/SEOContent",
  "./models/SEOImage",
  "./models/ServiceCard",
  "./models/DynamicContent",
  "./models/CompanyContent",
  "./models/ValuesImage",
  "./models/HistoryImage",
  "./models/VisionImage",
  "./models/ServiceDetail",
  "./models/ServiceCategory",
  "./models/RegionOneImage",
  "./models/CompanyCount",
  "./models/Banner",
  "./models/Employee",
  "./models/Team",
  "./models/Users",
  "./models/StoreSection",
  "./models/AboutDescription"
].map(require);

// App Configurations
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Serve static files
const staticDirs = ["css", "js", "html", "images"];
staticDirs.forEach((dir) =>
  app.use(`/${dir}`, express.static(path.join(__dirname, dir)))
);

// MongoDB Connection
mongoose
  .connect(
    `mongodb://admin:kolotripida12@ac-msftt37-shard-00-00.gsxb8us.mongodb.net:27017,ac-msftt37-shard-00-01.gsxb8us.mongodb.net:27017,ac-msftt37-shard-00-02.gsxb8us.mongodb.net:27017/your_database_name?replicaSet=atlas-qhtmiu-shard-0&authSource=admin&tls=true    `,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    console.log("Successfully connected to MongoDB");
  })
  .catch((error) => {
    console.log("Failed to connect to MongoDB: ", error);
  });

// Email Configurations
process.env.EMAIL_USER = "panagiotis.pitsis@gmail.com";
process.env.EMAIL_PASS = "zocc xfix pdsg ebxh";

// Middlewares
const upload = multer();
app.use(
  session({
    name: "example.sid",
    secret: "Replace with your secret key", // Use a strong, unique secret
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false, // Set to true in production with HTTPS
      maxAge: 1000 * 60 * 60 * 7, // Session expiry time
    },
    store: MongoStore.create({
      mongoUrl:
      `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.gsxb8us.mongodb.net/${process.env.DB_NAME}`,
    }),
  })
);

// Routes
app.get("/", (req, res) =>
  res.sendFile(path.join(__dirname, "html", "index.html"))
);
app.get("/company", (req, res) =>
  res.sendFile(path.join(__dirname, "html", "company.html"))
);
app.get("/login", (req, res) =>
  res.sendFile(path.join(__dirname, "html", "login.html"))
);
app.get("/news", (req, res) =>
  res.sendFile(path.join(__dirname, "html", "news.html"))
);
app.get("/services", (req, res) =>
  res.sendFile(path.join(__dirname, "html", "services.html"))
);
app.get("/contactUs", (req, res) =>
  res.sendFile(path.join(__dirname, "html", "contactus.html"))
);
app.get("/js/backadmin.js", (req, res) =>
  res.sendFile(path.join(__dirname, "js", "backadmin.js"))
);
app.get("/backoffice", checkAdminSession, (req, res) =>
  res.sendFile(path.join(__dirname, "html", "backoffice.html"))
);
app.get("/aboutus-admin", checkAdminSession, (req, res) =>
  res.sendFile(path.join(__dirname, "html", "aboutus-admin.html"))
);
app.get("/company-admin", checkAdminSession, (req, res) =>
  res.sendFile(path.join(__dirname, "html", "company-admin.html"))
);
app.get("/services-admin", checkAdminSession, (req, res) =>
  res.sendFile(path.join(__dirname, "html", "services-admin.html"))
);

// Company Count Routes
app.get("/api/get-company-count", async (req, res) => {
  try {
    const countData = await CompanyCount.findOne();
    res.json({ count: countData?.count || 0 });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.post("/api/update-company-count", async (req, res) => {
  try {
    const { count } = req.body;
    const countData = await CompanyCount.findOneAndUpdate(
      {},
      { count },
      { new: true, upsert: true }
    );
    res.json({ count: countData.count });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Company Team
app.get("/api/get-team-data", async (req, res) => {
  try {
    const teamData = await TeamSchema.findOne();
    res.json(teamData);
  } catch (error) {
    console.error("Error fetching team data:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.post("/api/update-team-data", upload.single("image"), async (req, res) => {
  try {
    const { teamHeader, teamDescription } = req.body;
    const imageData = req.file.buffer;

    // Update the team data, or create a new record if none exists
    const updatedTeamData = await TeamSchema.findOneAndUpdate(
      {},
      {
        teamHeader,
        teamDescription,
        image: imageData,
      },
      { upsert: true, new: true }
    );

    res.json({ success: true });
  } catch (error) {
    console.error("Error updating team data:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

//Admin Validation
function checkAdminSession(req, res, next) {
  if (req.session && req.session.isAdminLoggedIn) {
    next();
  } else {
    res.redirect("/login");
  }
}

// Fetch service cards
app.get("/api/services-card", async (req, res) => {
  try {
    const services = await ServiceCard.find();
    res.json(services);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch services" });
  }
});

app.get("/api/get-description", async (req, res) => {
  try {
    const companyParagraph = await CompanyCount.findOne();
    if (companyParagraph) {
      res.json({ description: companyParagraph.description });
    }
  } catch (error) {
    console.error("Error fetching description:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.post("/api/update-description", async (req, res) => {
  try {
    const { description } = req.body;

// Get all store sections
app.get("/api/store-section", async (req, res) => {
  try {
    const sections = await StoreSection.find({});
    res.status(200).json(sections);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all team sections
app.get("/api/team-sections", async (req, res) => {
  try {
    const sections = await TeamSection.find({});
    res.status(200).json(sections);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Endpoint to add/update a Store Section
// Endpoint to add/update a Store Section
app.post("/api/store-section", async (req, res) => {
  const updateData = {};

  // Check and structure the incoming data as per the new schema
  if (req.body.title) {
    updateData["title"] = req.body.title;
  }
  if (req.body.description) {
    updateData["description"] = req.body.description;
  }

  // Use findOneAndUpdate for adding or updating the store section
  try {
    const section = await StoreSection.findOneAndUpdate(
      { /* criteria to find the section, if it's an update */ },
      { $set: updateData },
      { new: true, upsert: true }
    );
    res.status(201).json(section);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Add a new team section
app.post("/api/team-sections", async (req, res) => {
  const section = new TeamSection(req.body);
  try {
    const newSection = await section.save();
    res.status(201).json(newSection);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});


    // Update the description, or create a new record if none exists
    const updatedParagraph = await CompanyCount.findOneAndUpdate(
      {},
      { description },
      { upsert: true, new: true }
    );

    res.json({ success: true, description: updatedParagraph.description });
  } catch (error) {
    console.error("Error updating description:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.get("/api/employees", async (req, res) => {
  try {
    let employees = await EmployeeSchema.find();
    res.json(employees);
  } catch (error) {
    console.error("Error fetching employees:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.get("/api/employee-image/:id", async (req, res) => {
  try {
    const employee = await EmployeeSchema.findById(req.params.id);
    if (!employee || !employee.image) {
      throw new Error("No image found");
    }

    res.setHeader("Content-Type", employee.contentType);
    res.send(employee.image);
  } catch (error) {
    console.error("Error fetching employee image:", error);
    res.status(404).json({ message: "Image not found" });
  }
});

app.get("/api/employees/store/:storeName", async (req, res) => {
  try {
    const employees = await EmployeeSchema.find({
      store: req.params.storeName,
    });
    res.json(employees);
  } catch (error) {
    console.error("Error fetching employees for store:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.post("/api/add-employee", upload.single("image"), async (req, res) => {
  try {
    const { name, title, store } = req.body;

    let newEmployee = new EmployeeSchema({
      name,
      title,
      store,
      image: req.file.buffer, // <-- Note the field name change
      contentType: req.file.mimetype,
    });

    await newEmployee.save();
    res.json({ message: "EmployeeSchema added!" });
  } catch (error) {
    console.error("Error adding employee:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.put(
  "/api/update-employee/:id",
  upload.single("image"),
  async (req, res) => {
    try {
      const employeeId = req.params.id;
      let updatedData = req.body;

      // Check if an image is uploaded and update it accordingly
      if (req.file) {
        updatedData.image = req.file.buffer;
        updatedData.contentType = req.file.mimetype;
      }

      const updatedEmployee = await EmployeeSchema.findByIdAndUpdate(
        employeeId,
        updatedData,
        { new: true }
      );

      if (!updatedEmployee) {
        return res.status(404).json({ message: "Employee not found!" });
      }

      res.json(updatedEmployee);
    } catch (error) {
      console.error("Error updating employee:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
);

app.delete("/api/delete-employee/:id", async (req, res) => {
  try {
    await EmployeeSchema.findByIdAndRemove(req.params.id);
    res.json({ message: "EmployeeSchema deleted!" });
  } catch (error) {
    console.error("Error deleting employee:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Update the company count
app.post("/api/update-company-count", async (req, res) => {
  try {
    const { count } = req.body;
    const countData = await CompanyCount.findOneAndUpdate(
      {},
      { count },
      { new: true, upsert: true }
    );
    res.json({ count: countData.count });
  } catch (error) {
    console.error("Error updating company count:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// server.js
app.get("/api/update-dynamic-content", async (req, res) => {
  const content = await DynamicContent.findOne({});
  res.json(content);
});
app.get("/js/backadmin.js", (req, res) => {
  res.sendFile(path.join(__dirname, "js", "backadmin.js"));
});
// Serve index.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "html", "index.html"));
});

// Serve index.html
app.get("/robots.txt", (req, res) => {
  res.sendFile(path.join(__dirname, "html", "robots.txt"));
});


app.post("/api/set-active-image/:section/:id", async (req, res) => {
  const { section, id } = req.params;

  let Model;
  switch (section) {
    case "history":
      Model = HistoryImage;
      break;
    case "values":
      Model = ValuesImage;
      break;
    case "vision":
      Model = VisionImage;
      break;
    default:
      return res.status(400).json({ message: "Invalid section" });
  }

  try {
    await Model.updateMany({}, { isActive: false });
    await Model.findByIdAndUpdate(id, { isActive: true }, { new: true });
    res.json({ message: `Image set as active in ${section} section.` });
  } catch (error) {
    console.error(`Failed to set image as active: ${error}`);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Create a new detailed service
app.post("/api/service-details", async (req, res) => {
  const { title, description } = req.body;

  // Basic validation to check both languages are provided for title and description
  if (!title || !title.en || !title.gr || !description || !description.en || !description.gr) {
    return res.status(400).json({
      message: "Both English and Greek fields for title and description are required."
    });
  }

  try {
    const detail = new ServiceDetail({ title, description });
    await detail.save();
    res.json(detail);
  } catch (error) {
    res.status(500).json({
      message: "Error adding service detail.",
      detailedError: error.message,
    });
  }
});

app.get("/api/service-details", async (req, res) => {
  try {
    let details = await ServiceDetail.find();

    // Optionally filter by language if a lang query parameter is provided
    const lang = req.query.lang; // Example usage: /api/service-details?lang=en
    if (lang) {
      details = details.map(detail => ({
        _id: detail._id,
        title: detail.title[lang] || detail.title['en'], // Fallback to English
        description: detail.description[lang] || detail.description['en'], // Fallback to English
      }));
    }

    res.json(details);
  } catch (error) {
    res.status(500).json({ message: "Error fetching service details." });
  }
});

// Fetch a single detailed service by ID
app.get("/api/service-details/:id", async (req, res) => {
  try {
    const detail = await ServiceDetail.findById(req.params.id);
    if (!detail) {
      res.status(404).json({ message: "Service detail not found." });
    } else {
      res.json(detail);
    }
  } catch (error) {
    res.status(500).json({ message: "Error fetching service detail." });
  }
});

app.put("/api/service-details/:id", async (req, res) => {
  const { lang, data } = req.body;

  // Construct the update object dynamically based on the provided language
  let update = {};
  if (data.title) update[`title.${lang}`] = data.title;
  if (data.description) update[`description.${lang}`] = data.description;

  try {
    const updatedDetail = await ServiceDetail.findByIdAndUpdate(req.params.id, {
      $set: update
    }, { new: true });

    if (!updatedDetail) {
      return res.status(404).json({ message: "Service detail not found." });
    }

    res.json(updatedDetail);
  } catch (error) {
    res.status(500).json({ message: "Error updating service detail.", detailedError: error.message });
  }
});


// Delete a detailed service by ID
app.delete("/api/service-details/:id", async (req, res) => {
  try {
    const deletedDetail = await ServiceDetail.findByIdAndDelete(req.params.id);
    if (!deletedDetail) {
      res.status(404).json({ message: "Service detail not found." });
    } else {
      res.json({ message: "Service detail deleted successfully." });
    }
  } catch (error) {
    res.status(500).json({ message: "Error deleting service detail." });
  }
});

//listen logo
app.get("/api/logo", async (req, res) => {
  const logo = await Logo.findOne(); // gets the first logo, adjust as needed
  res.set("Content-Type", logo.contentType);
  res.send(logo.data);
});

app.post("/api/upload-logo", upload.single("logo"), async (req, res) => {
  try {
    // Create new logo instance
    const newLogo = new Logo({
      name: req.body.name || "Unnamed Logo", // Get name from request body or default to 'Unnamed Logo'
      data: req.file.buffer,
      contentType: req.file.mimetype,
      isActive: true,
    });

    // Save to database
    await newLogo.save();

    // Optionally, deactivate other logos if you want only one active logo at a time
    await Logo.updateMany({ _id: { $ne: newLogo._id } }, { isActive: false });

    res
      .status(200)
      .send({ message: "Logo uploaded and activated successfully!" });
  } catch (error) {
    console.error("Error uploading logo:", error);
    res.status(500).send({ message: "Failed to upload logo" });
  }
});

//   Get all banners
app.get("/api/banners", async (req, res) => {
  const banners = await Banner.find({});
  res.json(banners);
});

app.get("/api/banners/:id", async (req, res) => {
  const banner = await Banner.findById(req.params.id);
  if (!banner) {
    return res.status(404).send("Banner not found");
  }
  res.set("Content-Type", banner.contentType);
  res.send(banner.image); // <-- Note the field name change
});

app.get("/api/logos", async (req, res) => {
  const logos = await Logo.find({});
  res.json(logos);
});

// Endpoint to get the currently active logo
app.get("/api/active-logo", async (req, res) => {
  try {
    const activeLogo = await Logo.findOne({ isActive: true });

    if (!activeLogo) {
      return res.status(404).json({ message: "No active logo found" });
    }

    res.set("Content-Type", activeLogo.contentType);
    res.send(activeLogo.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Endpoint to get the SEO Content based on language preference
app.get("/api/seo-content", async (req, res) => {
  const lang = req.query.lang || "gr"; // Default to Greek if not provided

  const content = await SEOContent.findOne(); // gets the first record
  if (!content) {
    res.json({ title: "", description: "" });
  } else {
    res.json({
      title: content.title[lang],
      description: content.description[lang],
      imagePath: content.imagePath,
      contentType: content.contentType,
    });
  }
});

app.post("/api/select-logo", async (req, res) => {
  const { logoId } = req.body;

  try {
    // Deactivate all logos
    await Logo.updateMany({}, { isActive: false });

    // Activate the selected logo
    const updatedLogo = await Logo.findByIdAndUpdate(logoId, {
      isActive: true,
    });

    if (!updatedLogo) {
      return res.status(404).json({ message: "Logo not found" });
    }

    res.json({ message: "Logo has been updated" });
  } catch (error) {
    console.error("Error selecting logo:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Upload a new banner
app.post("/api/upload-banner", upload.single("banner"), async (req, res) => {
  // Assume Banner is a Mongoose model like Logo
  const newBanner = new Banner({
    image: req.file.buffer, // <-- Note the field name change
    contentType: req.file.mimetype,
  });
  await newBanner.save();
  res.json({ message: "Banner uploaded" });
});

// Endpoint to set/update the SEO Content
app.post("/api/seo-content", async (req, res) => {
  const updateData = {};

  if (req.body.titleGr !== undefined) {
    updateData["title.gr"] = req.body.titleGr;
  }

  if (req.body.descriptionGr !== undefined) {
    updateData["description.gr"] = req.body.descriptionGr;
  }

  if (req.body.titleEn !== undefined) {
    updateData["title.en"] = req.body.titleEn;
  }

  if (req.body.descriptionEn !== undefined) {
    updateData["description.en"] = req.body.descriptionEn;
  }

  const content = await SEOContent.findOneAndUpdate(
    {},
    { $set: updateData },
    { new: true, upsert: true }
  );
  res.json(content);
});

// Delete a banner by ID
app.delete("/api/delete-banner/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await Banner.findByIdAndDelete(id);

    if (!result) {
      return res.status(404).json({ message: "Banner not found" });
    }

    res.json({ message: "Banner deleted successfully" });
  } catch (error) {
    console.error("Delete failed:", error);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.toString() });
  }
});

// Endpoint to set/update the Dynamic Content
app.post("/api/update-dynamic-content", async (req, res) => {
  const { title, description } = req.body;
  const content = await DynamicContent.findOneAndUpdate(
    {},
    { title, description },
    { new: true, upsert: true }
  );

  res.json(content);
});

app.get("/api/seoimages", async (req, res) => {
  try {
    const seoImages = await SEOImage.find(); // Fetch all SEOImage records
    const simplifiedImages = seoImages.map((img) => ({
      _id: img._id,
      contentType: img.contentType,
      // Add any other fields you might want to send to the client
    }));
    res.json(simplifiedImages);
  } catch (error) {
    console.error("Fetch failed:", error);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.toString() });
  }
});

app.delete("/api/delete-seo-image/:id", async (req, res) => {
  try {
    const imageId = req.params.id;
    await SEOImage.findByIdAndDelete(imageId);
    res.json({ message: "SEO Image deleted successfully" });
  } catch (error) {
    console.error("Delete failed:", error);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.toString() });
  }
});

app.post(
  "/api/upload-region-one-image",
  upload.single("regionOneImage"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const newImage = new RegionOneImage({
        name: req.file.originalname,
        image: req.file.buffer,
        contentType: req.file.mimetype,
        isActive: false, // By default, new uploads are not active. Change this if needed.
      });

      await newImage.save();

      res.json({ message: "Image uploaded successfully!" });
    } catch (error) {
      console.error("Error uploading region one image:", error);
      res
        .status(500)
        .json({ message: "Internal Server Error", error: error.toString() });
    }
  }
);

app.get("/api/get-region-one-image/:id", async (req, res) => {
  try {
    const image = await RegionOneImage.findById(req.params.id);
    if (image) {
      res.set("Content-Type", image.contentType);
      res.send(image.image);
    } else {
      res.status(404).send("Image not found");
    }
  } catch (error) {
    console.error("Error fetching region one image:", error);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.toString() });
  }
});

app.get("/api/fetch-all-region-one-images", async (req, res) => {
  try {
    const images = await RegionOneImage.find(); // You might want to modify the model if you store images separately
    res.json(images);
  } catch (error) {
    console.error("Error fetching all region one images:", error);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.toString() });
  }
});

app.post("/api/select-region-one-image", async (req, res) => {
  try {
    const { imageId } = req.body;

    // First, set all images to inactive
    await RegionOneImage.updateMany({}, { isActive: false });

    // Then, set the selected image to active
    const updatedImage = await RegionOneImage.findByIdAndUpdate(
      imageId,
      { isActive: true },
      { new: true }
    );

    if (updatedImage) {
      res.json({ success: true, message: "Image set as active." });
    } else {
      res.status(404).send("Image not found.");
    }
  } catch (error) {
    console.error("Error selecting the active image:", error);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.toString() });
  }
});

app.get("/api/fetch-active-region-one-image", async (req, res) => {
  try {
    const activeImage = await RegionOneImage.findOne({ isActive: true });

    if (activeImage && activeImage.image) {
      res.set("Content-Type", activeImage.contentType);
      res.send(activeImage.image); // Sending the image data from the 'image' field
    } else {
      res.status(404).send("Active image not found");
    }
  } catch (error) {
    console.error("Failed to fetch active region one image:", error);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.toString() });
  }
});

app.delete("/api/delete-region-one-image/:id", async (req, res) => {
  try {
    // Find the image using the ID from the request parameters and delete it
    const deletedImage = await RegionOneImage.findByIdAndDelete(req.params.id);

    if (deletedImage) {
      res.json({ message: "Image deleted successfully!" });
    } else {
      res.status(404).send("Image not found");
    }
  } catch (error) {
    console.error("Error deleting region one image:", error);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.toString() });
  }
});

app.get("/api/get-selected-seo-image", async (req, res) => {
  try {
    const selectedImage = await SEOImage.findOne({ isActive: true });
    if (selectedImage && selectedImage.image) {
      res.set("Content-Type", selectedImage.contentType);
      res.send(selectedImage.image); // Sending the image data from the 'image' field
    } else {
      res.status(404).send("No selected SEO image found.");
    }
  } catch (error) {
    console.error("Fetch failed:", error);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.toString() });
  }
});

app.post("/api/select-seo-image", async (req, res) => {
  try {
    const { seoImageId } = req.body;

    // First, set all images to inactive
    await SEOImage.updateMany({}, { isActive: false });

    // Then, set the chosen image to active
    await SEOImage.findByIdAndUpdate(seoImageId, { isActive: true });

    res.json({ message: "SEO Image selected successfully" });
  } catch (error) {
    console.error("Failed to select SEO image:", error);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.toString() });
  }
});

app.post("/api/upload-seo", upload.single("seoImage"), async (req, res) => {
  try {
    // Check if file is uploaded
    if (!req.file) {
      console.error("No file uploaded.");
      return res.status(400).send("No file uploaded.");
    }

    // Save the image filename or path to the database
    const newSEOImage = {
      name: req.file.originalname,
      image: req.file.buffer, // Storing the image data in the 'image' field
      contentType: req.file.mimetype,
    };

    const seoImage = new SEOImage(newSEOImage);
    await seoImage.save();

    res.json({ message: "SEO Image uploaded", filename: req.file.filename });
  } catch (error) {
    console.error("Upload failed:", error);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.toString() });
  }
});
// Endpoint to set/update the Company Content
app.post("/api/company-content", async (req, res) => {
  const {
    historyTitle,
    historyDescription,
  } = req.body;

  // Update the content in the database
  const content = await CompanyContent.findOneAndUpdate(
    {},
    {
      historyTitle: { Gr: historyTitle.Gr, En: historyTitle.En || "" },
      historyDescription: {
        Gr: historyDescription.Gr,
        En: historyDescription.En || "",
      },
      // valuesTitle: { Gr: valuesTitle.Gr, En: valuesTitle.En || "" },
      // valuesDescription: {
      //   Gr: valuesDescription.Gr,
      //   En: valuesDescription.En || "",
      // },
      // visionTitle: { Gr: visionTitle.Gr, En: visionTitle.En || "" },
      // visionDescription: {
      //   Gr: visionDescription.Gr,
      //   En: visionDescription.En || "",
      // },
    },
    { new: true, upsert: true }
  );

  res.json(content);
});

// Serve history image
app.get("/api/history-image", async (req, res) => {
  try {
    const historyImage = await HistoryImage.findOne();
    if (!historyImage) {
      return res.status(404).json({ message: "History image not found" });
    }
    res.set("Content-Type", historyImage.contentType);
    res.send(historyImage.data);
  } catch (error) {
    console.error("Error fetching history image:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Serve history image
app.get("/api/values-image", async (req, res) => {
  try {
    const valuesImage = await ValuesImage.findOne();
    if (!valuesImage) {
      return res.status(404).json({ message: "Values image not found" });
    }

    // Set the appropriate content type based on your image data
    res.set("Content-Type", valuesImage.contentType);

    // Send the image data as a response
    res.send(valuesImage.data);
  } catch (error) {
    console.error("Error fetching values image:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.get("/api/vision-image", async (req, res) => {
  try {
    const visionImage = await VisionImage.findOne();
    if (!visionImage) {
      return res.status(404).json({ message: "Vision image not found" });
    }

    // Set the appropriate content type based on your image data
    res.set("Content-Type", visionImage.contentType);

    // Send the image data as a response
    res.send(visionImage.data);
  } catch (error) {
    console.error("Error fetching vision image:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.get("/api/company-content", async (req, res) => {
  const content = await CompanyContent.findOne(); // gets the first record

  if (!content) {
    res.json({
      historyTitle: { Gr: "", En: "" },
      historyDescription: { Gr: "", En: "" },
    });
  } else {
    res.json(content);
  }
});

//History Image
app.post(
  "/api/upload-history-image",
  upload.single("historyImage"),
  async (req, res) => {
    try {
      const newHistoryImage = new HistoryImage({
        name: req.file.originalname,
        data: req.file.buffer,
        contentType: req.file.mimetype,
      });
      await newHistoryImage.save();
      res.json({ message: "History image uploaded" });
    } catch (error) {
      console.error("Upload failed:", error);
      res
        .status(500)
        .json({ message: "Internal Server Error", error: error.toString() });
    }
  }
);

app.get("/api/get-history-image/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const historyImage = await HistoryImage.findById(id);

    if (!historyImage) {
      return res.status(404).json({ message: "Image not found" });
    }

    res.set("Content-Type", historyImage.contentType);
    res.send(historyImage.data);
  } catch (error) {
    console.error("Error fetching image:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.get("/api/get-history-images", async (req, res) => {
  try {
    const images = await HistoryImage.find({}, "name");
    res.json(images);
  } catch (error) {
    console.error("Fetch failed:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.delete("/api/delete-image/:section/:id", async (req, res) => {
  const { section, id } = req.params;

  let Model;
  switch (section) {
    case "history":
      Model = HistoryImage;
      break;
    case "values":
      Model = ValuesImage;
      break;
    case "vision":
      Model = VisionImage;
      break;
    default:
      return res.status(400).json({ message: "Invalid section" });
  }

  try {
    const result = await Model.findByIdAndDelete(id);
    if (result) {
      res.json({ message: `Successfully deleted ${section} image.` });
    } else {
      res.status(404).json({ message: "Image not found" });
    }
  } catch (error) {
    console.error(`Delete failed: ${error}`);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

//Values Image
app.post(
  "/api/upload-values-image",
  upload.single("valuesImage"),
  async (req, res) => {
    try {
      const newValuesImage = new ValuesImage({
        name: req.file.originalname,
        data: req.file.buffer,
        contentType: req.file.mimetype,
      });
      await newValuesImage.save();
      res.json({ message: "Values image uploaded" });
    } catch (error) {
      console.error("Upload failed:", error);
      res
        .status(500)
        .json({ message: "Internal Server Error", error: error.toString() });
    }
  }
);

//Values Image
app.get("/api/get-values-images", async (req, res) => {
  try {
    const images = await ValuesImage.find({}, "_id");
    res.json(images);
  } catch (error) {
    console.error("Fetch failed:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

//Vision Image
app.get("/api/get-vision-images", async (req, res) => {
  try {
    const images = await VisionImage.find({}, "_id"); //
    res.json(images);
  } catch (error) {
    console.error("Fetch failed:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

//Vision Image
app.post(
  "/api/upload-vision-image",
  upload.single("visionImage"),
  async (req, res) => {
    try {
      const newVisionImage = new VisionImage({
        name: req.file.originalname,
        data: req.file.buffer,
        contentType: req.file.mimetype,
      });
      await newVisionImage.save();
      res.json({ message: "Vision image uploaded" });
    } catch (error) {
      console.error("Upload failed:", error);
      res
        .status(500)
        .json({ message: "Internal Server Error", error: error.toString() });
    }
  }
);

//Route to handle form submissions and send email
app.post("/submit", async (req, res) => {
  const { name, email, message } = req.body;
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // Set up email data
  let mailOptions = {
    from: process.env.EMAIL_USER,
    to: "panagiotis.pitsis@gmail.com",
    subject: "New Contact Form Submission",
    text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
  };

  // Send email
  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Failed to send email:", error);
  }
});

// Fetch all service categories and their associated services
app.get("/api/service-categories", async (req, res) => {
  try {
    const categories = await ServiceCategory.find();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch categories." });
  }
});

// Add a new service category
app.post("/api/service-categories", async (req, res) => {
  const { categoryName, services } = req.body;
  // Ensure the incoming data structure conforms to the bilingual schema
  const newCategory = new ServiceCategory({
    categoryName, // This should be an object with 'en' and 'gr' properties
    services // Each service should also have 'en' and 'gr' properties for 'serviceName' and 'description'
  });

  try {
    const savedCategory = await newCategory.save();
    res.json(savedCategory);
  } catch (error) {
    res.status(500).json({ message: "Failed to add category." });
  }
});
// Fetch a single service category by its ID
app.get("/api/service-categories/:id", async (req, res) => {
  try {
    const category = await ServiceCategory.findById(req.params.id);
    if (!category) {
      res.status(404).json({ message: "Service category not found." });
    } else {
      res.json(category);
    }
  } catch (error) {
    res.status(500).json({ message: "Error fetching service category." });
  }
});

//Admin login
app.post("/api/login", async function (req, res) {
  const { username, password } = req.body;

  try {
    // Assuming you have a MongoDB collection named 'users'
    // And the schema includes fields 'username' and 'password'
    const user = await mongoose.model("Users").findOne({ username: username });

    if (!user) {
      res.json({ success: false, message: "User not found" });
    } else if (user.password === password) {
      // You should use password hashing in production
      req.session.isAdminLoggedIn = true; // Set session flag only if auth is successful
      res.json({ success: true });
    } else {
      res.json({ success: false });
    }
  } catch (err) {
    res.json({ success: false, message: "An error occurred" });
  }
});

//Logout Admin
app.get("/logout", function (req, res) {
  // Destroy the session
  req.session.destroy(function (err) {
    if (err) {
      // Handle error
      console.error("Session destruction error:", err);
      res.send("Error occurred during logout");
    } else {
      // Redirect to login page or home page
      res.redirect("/html/login.html"); // Modify this URL as needed
    }
  });
});

// Update an existing service category
app.put("/api/service-categories/:id", async (req, res) => {
  try {
    const updatedCategory = await ServiceCategory.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedCategory);
  } catch (error) {
    res.status(500).json({ message: "Failed to update category." });
  }
});

// Delete a service category
app.delete("/api/service-categories/:id", async (req, res) => {
  try {
    await ServiceCategory.findByIdAndDelete(req.params.id);
    res.json({ message: "Category deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete category." });
  }
});

// Catch-all route should be last
app.get("*", (req, res) => {
  console.log("Unmatched route:", req.path);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
