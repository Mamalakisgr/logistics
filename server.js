const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const path = require('path');
const multer = require('multer');
const nodemailer = require('nodemailer');
const upload = multer();
const Logo = require('./models/Logo'); // Make sure the path is correct
const SEOContent = require('./models/SEOContent'); // Import the model
const SEOImage = require('./models/SEOImage');  // Adjust the path to match your project structure
const DynamicContent = require('./models/DynamicContent');  // Adjust the path to match your project structure
const CompanyContent = require('./models/CompanyContent');  // Adjust the path to match your project structure
const ValuesImage = require('./models/ValuesImage');  // Adjust the path to match your project structure
const HistoryImage = require('./models/HistoryImage');  // Adjust the path to match your project structure
const VisionImage = require('./models/VisionImage');  // Adjust the path to match your project structure
const bodyParser = require('body-parser');  // Add this if it's not already in your file
const Service = require('./models/Service');

process.env.EMAIL_USER="nikosionianisia@gmail.com";
process.env.EMAIL_PASS="byep dnan ipbv dpfo";
const Banner = require('./models/Banner');

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));  // Add this if it's not already in your file

// Serve static files
app.use('/css', express.static(path.join(__dirname, 'css')));
app.use('/js', express.static(path.join(__dirname, 'js')));
app.use('/html', express.static(path.join(__dirname, 'html')));
app.use('/images', express.static(path.join(__dirname, 'images')));
// Connect to MongoDB via Mongoose
mongoose.connect('mongodb+srv://admin:pass@cluster0.gsxb8us.mongodb.net/your_database_name', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("Successfully connected to MongoDB"))
.catch(error => console.log("Failed to connect to MongoDB: ", error));

// Middleware
app.use(express.json());


// server.js
app.get('/api/update-dynamic-content', async (req, res) => {
  const content = await DynamicContent.findOne({});
  res.json(content);
});
app.get('/js/backadmin.js', (req, res) => {
  res.sendFile(path.join(__dirname, 'js', 'backadmin.js'));
});
// Serve index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'html', 'index.html'));
});

app.put('/api/set-active-image/:section/:id', async (req, res) => {
  const { section, id } = req.params;
  
  let Model;
  switch(section) {
    case 'history':
      Model = HistoryImage;
      break;
    case 'values':
      Model = ValuesImage;
      break;
    case 'vision':
      Model = VisionImage;
      break;
    default:
      return res.status(400).json({ message: 'Invalid section' });
  }
  
  try {
    await Model.updateMany({}, { isActive: false });
    await Model.findByIdAndUpdate(id, { isActive: true });
    res.json({ message: `Image set as active in ${section} section.` });
  } catch (error) {
    console.error(`Failed to set image as active: ${error}`);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});


//listen logo
// API Endpoints for logos
app.get('', async (req, res) => {
  const logo = await Logo.findOne(); // gets the first logo, adjust as needed
  res.set('Content-Type', logo.contentType);
  res.send(logo.data);
});

app.post('/api/upload-logo', upload.single('logo'), async (req, res) => {
  console.log("Received request to upload logo");
  
  // Debugging: Check what's in req.file
  if (req.file) {
    console.log("Received file:", req.file);
  } else {
    console.log("Did not receive any file");
  }
    // Deactivate all existing logos
    await Logo.updateMany({}, { isActive: false });
    console.log("Deactivated all existing logos.");  // Debugging line
    
    // Upload and activate new logo
    const newLogo = new Logo({
      data: req.file.buffer,
      contentType: 'image/png',
      isActive: true
    });
    await newLogo.save();
    console.log("New logo uploaded and activated.");  // Debugging line
  
    res.json({ message: 'Logo uploaded and activated' });
  } 
  
);
//   Get all banners
app.get('/api/banners', async (req, res) => {
  const banners = await Banner.find({});
  res.json(banners);
});

app.get('/api/banners/:id', async (req, res) => {
  const banner = await Banner.findById(req.params.id);
  if (!banner) {
    return res.status(404).send('Banner not found');
  }
  res.set('Content-Type', banner.contentType);
  res.send(banner.image);  // <-- Note the field name change
});

app.get('/api/logos', async (req, res) => {
  const logos = await Logo.find({});
  res.json(logos);
});
// Endpoint to get the currently active logo
app.get('/api/active-logo', async (req, res) => {
  try {
    const activeLogo = await Logo.findOne({ isActive: true });
    
    if (!activeLogo) {
      return res.status(404).json({ message: 'No active logo found' });
    }

    res.set('Content-Type', activeLogo.contentType);
    res.send(activeLogo.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
// Endpoint to get the SEO Content
app.get('/api/seo-content', async (req, res) => {
  const content = await SEOContent.findOne(); // gets the first record
  if (!content) {
    res.json({title: "", description: ""});
  } else {
    res.json(content);
  }
});


app.post('/api/select-logo', async (req, res) => {
  const { logoId } = req.body;
  
  // Deactivate all logos
  await Logo.updateMany({}, { isActive: false });
  
  // Activate the selected logo
  await Logo.findByIdAndUpdate(logoId, { isActive: true });
  
  res.json({ message: 'Logo has been updated' });
});



// Upload a new banner
app.post('/api/upload-banner', upload.single('banner'), async (req, res) => {
  // Assume Banner is a Mongoose model like Logo
  const newBanner = new Banner({
    image: req.file.buffer,  // <-- Note the field name change
    contentType: req.file.mimetype
  });
  await newBanner.save();
  res.json({ message: 'Banner uploaded' });
});

// Endpoint to set/update the SEO Content
app.post('/api/seo-content', async (req, res) => {
  const { title, description } = req.body;

  // Search for existing SEO content and update it
  // or create a new one if not found
  const content = await SEOContent.findOneAndUpdate({}, {title, description}, {new: true, upsert: true});

  res.json(content);
});
// Delete a banner by ID
app.delete('/api/delete-banner/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await Banner.findByIdAndDelete(id);

    if (!result) {
      return res.status(404).json({ message: 'Banner not found' });
    }

    res.json({ message: 'Banner deleted successfully' });
  } catch (error) {
    console.error("Delete failed:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.toString() });
  }
});// Endpoint to set/update the Dynamic Content
app.post('/api/update-dynamic-content', async (req, res) => {
  const { title, description } = req.body;

  // Your logic to update the title and description in the database
  // For example, you might have a separate collection just for dynamic content
  const content = await DynamicContent.findOneAndUpdate({}, { title, description }, { new: true, upsert: true });

  res.json(content);
});
app.post('/api/upload-seo', upload.single('seoImage'), async (req, res) => {
  try {
    // Your upload logic here
    const newSEOImage = new SEOImage({
      data: req.file.buffer,
      contentType: req.file.mimetype
    });
    await newSEOImage.save();
    res.json({ message: 'SEO Image uploaded' });
  } catch (error) {
    console.error("Upload failed:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.toString() });
  }
});
// Endpoint to set/update the Company Content
app.post('/api/company-content', async (req, res) => {
  const { historyTitle, historyDescription, valuesTitle, valuesDescription, visionTitle, visionDescription } = req.body;

  // Update the content in the database
  const content = await CompanyContent.findOneAndUpdate({}, {
    historyTitle,
    historyDescription,
    valuesTitle,
    valuesDescription,
    visionTitle,
    visionDescription
  }, { new: true, upsert: true });

  res.json(content);
});
// Add this to your existing API routes
app.get('/api/services', async (req, res) => {
  const services = await Service.find({});
  res.json(services);
});

app.post('/api/services', async (req, res) => {
  const newService = new Service(req.body);
  await newService.save();
  res.json({ message: 'Service or category added successfully' });
});

app.put('/api/services/:id', async (req, res) => {
  await Service.findByIdAndUpdate(req.params.id, req.body);
  res.json({ message: 'Service or category updated successfully' });
});

app.delete('/api/services/:id', async (req, res) => {
  await Service.findByIdAndDelete(req.params.id);
  res.json({ message: 'Service or category deleted successfully' });
});
// Serve history image
app.get('/api/history-image', async (req, res) => {
  try {
    const historyImage = await HistoryImage.findOne();
    console.log("Serving history image:", historyImage);  // Debugging line
    if (!historyImage) {
      return res.status(404).json({ message: 'History image not found' });
    }
    res.set('Content-Type', historyImage.contentType);
    res.send(historyImage.data);
  } catch (error) {
    console.error('Error fetching history image:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Serve history image
app.get('/api/values-image', async (req, res) => {
  try {
    const valuesImage = await ValuesImage.findOne();
    if (!valuesImage) {
      return res.status(404).json({ message: 'Values image not found' });
    }

    // Set the appropriate content type based on your image data
    res.set('Content-Type', valuesImage.contentType);

    // Send the image data as a response
    res.send(valuesImage.data);
  } catch (error) {
    console.error('Error fetching values image:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});


// Serve history image
app.get('/api/vision-image', async (req, res) => {
  try {
    const visionImage = await VisionImage.findOne();
    if (!visionImage) {
      return res.status(404).json({ message: 'Vision image not found' });
    }

    // Set the appropriate content type based on your image data
    res.set('Content-Type', visionImage.contentType);

    // Send the image data as a response
    res.send(visionImage.data);
  } catch (error) {
    console.error('Error fetching vision image:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Example for the server-side
app.get('/api/company-content', async (req, res) => {
  const content = await CompanyContent.findOne(); // gets the first record
  console.log("Sending back content: ", content);
  if (!content) {
    res.json({
      historyTitle: "",
      historyDescription: "",
      valuesTitle: "",
      valuesDescription: "",
      visionTitle: "",
      visionDescription: ""
    });
  } else {
    res.json(content);
  }
});

//History Image
app.post('/api/upload-history-image', upload.single('historyImage'), async (req, res) => {
  try {
    const newHistoryImage = new HistoryImage({
      name: req.file.originalname,
      data: req.file.buffer,
      contentType: req.file.mimetype
    });
    await newHistoryImage.save();
    res.json({ message: 'History image uploaded' });
  } catch (error) {
    console.error("Upload failed:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.toString() });
  }
});


app.get('/api/get-history-image/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const historyImage = await HistoryImage.findById(id);

    if (!historyImage) {
      return res.status(404).json({ message: "Image not found" });
    }

    res.set('Content-Type', historyImage.contentType);
    res.send(historyImage.data);
  } catch (error) {
    console.error("Error fetching image:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});


// Get only the names (or IDs, titles, etc.) of all history images
app.get('/api/get-history-images', async (req, res) => {
  try {
    const images = await HistoryImage.find({}, 'name'); // Change 'name' to whatever field you use to identify images
    res.json(images);
  } catch (error) {
    console.error("Fetch failed:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.delete('/api/delete-image/:section/:id', async (req, res) => {
  const { section, id } = req.params;
  
  let Model;
  switch(section) {
    case 'history':
      Model = HistoryImage;
      break;
    case 'values':
      Model = ValuesImage;
      break;
    case 'vision':
      Model = VisionImage;
      break;
    default:
      return res.status(400).json({ message: 'Invalid section' });
  }

  try {
    const result = await Model.findByIdAndDelete(id);
    if (result) {
      res.json({ message: `Successfully deleted ${section} image.` });
    } else {
      res.status(404).json({ message: 'Image not found' });
    }
  } catch (error) {
    console.error(`Delete failed: ${error}`);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

//Values Image
app.post('/api/upload-values-image', upload.single('valuesImage'), async (req, res) => {
  try {
    const newValuesImage = new ValuesImage({
      name: req.file.originalname,
      data: req.file.buffer,
      contentType: req.file.mimetype
    });
    await newValuesImage.save();
    res.json({ message: 'Values image uploaded' });
  } catch (error) {
    console.error("Upload failed:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.toString() });
  }
});

// Get only the names (or IDs, titles, etc.) of all values images
app.get('/api/get-values-images', async (req, res) => {
  try {
    const images = await ValuesImage.find({}, '_id'); // Change '_id' to whatever field you use to identify images
    res.json(images);
  } catch (error) {
    console.error("Fetch failed:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Get only the names (or IDs, titles, etc.) of all vision images
app.get('/api/get-vision-images', async (req, res) => {
  try {
    const images = await VisionImage.find({}, '_id'); // Change '_id' to whatever field you use to identify images
    res.json(images);
  } catch (error) {
    console.error("Fetch failed:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});
//Vision Image
app.post('/api/upload-vision-image', upload.single('visionImage'), async (req, res) => {
  try {
    const newVisionImage = new VisionImage({
      name: req.file.originalname,
      data: req.file.buffer,
      contentType: req.file.mimetype
    });
    await newVisionImage.save();
    res.json({ message: 'Vision image uploaded' });
  } catch (error) {
    console.error("Upload failed:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.toString() });
  }
});

// Add this new POST route to handle form submissions and send email
app.post('/submit', async (req, res) => {
  const { name, email, message } = req.body;

  // Create a transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  // Set up email data
  let mailOptions = {
    from: process.env.EMAIL_USER,
    to: 'nikosionianisia@gmail.com',  // Or any email you want to send to
    subject: 'New Contact Form Submission',
    text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`
  };

  // Send email
  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Failed to send email:', error);
  }
});


// Catch-all route should be last
app.get('*', (req, res) => {
  console.log('Unmatched route:', req.path);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
