
import fs from 'fs';
export function imageUnlink(imagelink) {
  try{
    fs.unlink(imagelink, (err => { 
        if (err) console.log(err); 
        else { 
          console.log("\nDeleted file: "+imagelink); 
        } 
      }));
    }
    catch(err){
      console.log('errerrerrerr',err);
    }
  }

