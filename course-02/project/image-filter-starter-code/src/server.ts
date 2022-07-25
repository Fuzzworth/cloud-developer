import express from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util';
import { URL } from 'url';
import { readdir } from 'fs';
import path from 'path'

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // @TODO1 IMPLEMENT A RESTFUL ENDPOINT
  // GET /filteredimage?image_url={{URL}}
  // endpoint to filter an image from a public url.
  // IT SHOULD
  //    1
  //    1. validate the image_url query
  //    2. call filterImageFromURL(image_url) to filter the image
  //    3. send the resulting file in the response
  //    4. deletes any files on the server on finish of the response
  // QUERY PARAMATERS
  //    image_url: URL of a publicly accessible image
  // RETURNS
  //   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]

  /**************************************************************************** */

  //! END @TODO1
  
  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( req, res ) => {
    res.send("try GET /filteredimage?image_url={{}}");
  } );

  app.get( "/filteredimage", async ( req, res ) => {

    const image_url = req.query.image_url;

    try {
      const myURL = new URL(image_url);

      const filteredpath = await filterImageFromURL(myURL.href);
    
      res.sendFile(filteredpath);

      const upload_dir = path.dirname(filteredpath);
  
      readdir(upload_dir, (err, files) => {
        files.forEach(file => {
          console.log(path.resolve(upload_dir,file));
          deleteLocalFiles([path.resolve(upload_dir,file)]);
        });
      });

    } catch (error) {
      console.log(`${Date().toString()}: ${image_url} is not a valid url`);
      return res.status(400).send(`${image_url} is not a valid url`);
    }

  } );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();