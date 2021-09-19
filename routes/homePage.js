const { Router } = require('express')
const passport = require('passport')
const { google } = require('googleapis')
const AUTHKEYS = require('../configs/AuthKeys')
const bodyParser = require('body-parser');

const router = Router()

router.get('/', function (req, res) {
    res.render('homePage.html', { 'title': 'OAtuh 2.0 Application Home Page' })
})

router.get('/mainPage', function (req, res) {

    // if not user
    if (typeof req.user == "undefined") res.redirect('/auth/login/google')
    else {

        let parseData = {
            title: 'HOME PAGE',
            googleid: req.user._id,
            name: req.user.name,
            avatar: req.user.pic_url,
            email: req.user.email
        }

        // if redirect with google drive response
        if (req.query.file !== undefined) {

            // successfully upload
            if (req.query.file == "upload") parseData.file = "uploaded"
            else if (req.query.file == "notupload") parseData.file = "notuploaded"
        }

        res.render('mainPage.html', parseData)
    }
})

router.post('/upload', function (req, res) {

    // not auth
    if (!req.user) res.redirect('/auth/login/google')
    else {
        // auth user

        // config google drive with client token
        const oauth2Client = new google.auth.OAuth2()
        oauth2Client.setCredentials({
            'access_token': req.user.accessToken
        });

        const drive = google.drive({
            version: 'v3',
            auth: oauth2Client
        });

        //move file to google drive

        let { name: filename, mimetype, data } = req.files.file_upload

        const driveResponse = drive.files.create({
            requestBody: {
                name: filename,
                mimeType: mimetype
            },
            media: {
                mimeType: mimetype,
                body: Buffer.from(data).toString()
            }
        });

        driveResponse.then(data => {

            if (data.status == 200) res.redirect('/mainPage?file=upload') // success
            else res.redirect('/mainPage?file=notupload') // unsuccess

        }).catch(err => { throw new Error(err) })
    }
})

var urlencodedParser = bodyParser.urlencoded({ extended: false })

router.post("/addEvent", urlencodedParser, function (req, res) {
    if (!req.user) res.redirect('/auth/login/google')
    else
    {
        const oauth2Client = new google.auth.OAuth2()
        oauth2Client.setCredentials({
            'access_token': req.user.accessToken
        });
  
    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
    console.log(oauth2Client);
    var body_data = JSON.stringify(req.body);
  
    var objectVal = JSON.parse(body_data);
    var summary = objectVal.summary;
    var location = objectVal.location;
    var description = objectVal.description;
    var startTime = new Date(objectVal.start);
    var endTime = new Date(objectVal.end);

   
  
    var event = {
      summary: summary,
      location: location,
      description: description,
      start: {
        dateTime: startTime
      },
      end: {
        dateTime: endTime
      }
    };
  
    calendar.events.insert(
      {
        auth: oauth2Client,
        calendarId: 'primary',
        resource: event
      },
      function (err, event) {
  
        var result;
        var url = "no";
  
        if (err) {
          console.log('There was an error occured while connecting too the calender API: ' + err);
          result = false
  
        } else {
          console.log('Event created  successfully: %s', event.data.htmlLink);
          result = true
          url = event.data.htmlLink;
        }
  
        return res.json({ result: result, url: url });
      }
    );
    }
  })


  router.get("/api/event/oauthcallback", function (req, res) {

    var session = req.session;
    var code = req.query.code;
    
    client.getToken(code, function (err, tokens,  body) {
      session.tokens = tokens;
     console.log(tokens);
  
      client.setCredentials(tokens);
    });
    res.render("eventMessage.html");
  })

module.exports = router

