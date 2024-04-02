import express from 'express';
import mongoose from 'mongoose';
import { logger } from './middlewares/logger.js';

const app = express();
app.set('view engine', 'ejs');
const PORT = 3000;

app.use('/locations', express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(logger);

const thingsSchema = new mongoose.Schema({
  slug: { type: String, required: true },
  name: { type: String, required: true }, 
  updated: { type: Boolean, default: true, required: true }
});
const Things = mongoose.model('Things', thingsSchema);

app.post('/index', async (request, response) => {
  try {
    const { slug, name } = request.body;
    const things = new Things({ slug, name });
    await things.save();
    response.send('Berlin thing created');
  } catch (error) {
    console.error(error);
    response.send('Error: The Berlin thing could not be created.');
  }
});

mongoose.connect("mongodb+srv://rehankhurram:Y1bRQQzYVxKIvB4Y@berlinthings.3hwjb8l.mongodb.net/?retryWrites=true&w=majority&appName=Berlinthings")
  .then(() => console.log('💽 Database connected'))
  .catch(error => console.error(error));

app.get('/index/:slug/edit', async (request, response) => {
  try {
    const slug = request.params.slug
    const things = await Things.findOne({ slug: slug }).exec()
    if(!things) throw new Error('Berlinthing not found')

    response.render('edit', { things: things })
  }catch(error) {
    console.error(error)
    response.status(404).send('Could not find the Berlin thing you\'re looking for.')
  }
})

app.post('/index/:slug', async (request, response) => {
  try {
    const things = await Things.findOneAndUpdate(
      { slug: request.params.slug }, 
      request.body,
      { new: true}
    )
    response.redirect(`/index/${things.slug}`)
  }catch (error) {
    console.error(error)
    response.send('Error: The Berlin thing could not be update.')
  }
})

app.get('/index/new', async (request, response) => {
  try {
    const things = await Things.find({}).exec();
    response.render('new', { things });
  } catch (error) {
    console.error(error);
    response.render('new', { things: [] });
  }
});

app.get('/index/:slug/delete', async (request, response) => {
try {
  await Things.findOneAndDelete({ slug: request.params.slug})
  
  response.redirect('/index')
}catch (error) {
  console.error(error)
  response.send('Error: No Berlin thing was deleted.')
}
})


app.get(['/', '/index.html'], (request, response) => {
  const numberOfDaysPublished = 1;
  const things = [
    { name: "Berlin things", slug: "berlin-things", updated: true },
    { name: "places within Berlin", slug: "places", updated: false }
  ];
  response.render('index', { numberOfDaysPublished, things });
});

app.get("/login.html", (request, response) => {
  response.render("login");
});

app.get("/aboutme.html", (request, response) => {
  response.render("aboutme");
});

app.get('/contact', (request, response) => {
  response.send('Reach out to us if you have any questions.');
});

app.get('/Berlinthings/:travel', (request, response) => {
  const BerlinTravel = request.params.travel;
  response.send(`You chose the Berlinthing with the ID of ${BerlinTravel}`);
});

app.post('/contact', (request, response) => {
  response.send('Thank you for your message. We will be in touch soon.');
});

app.get('*', (_, response) => response.status(404).send("error this site cannot be reached right now"));

app.listen(PORT, () => {
  console.log(`👋 Started server on port ${PORT}`);
});
