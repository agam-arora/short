const express=require('express');
const router =express.Router();
const Url=require('./../model/urlmodel');
const shortid=require('shortid');
const validurl = require('valid-url')

router.post('/',async (req,res)=>{
    const origUrl=req.body.orignal;
    // console.log(origUrl);
    const base=process.env.BASE;
    const urlId=shortid.generate();
    const urlrecent= await Url.find({}).sort('-date').limit(10);
    const urlmax= await Url.find({}).sort('-clicks').limit(10);

    if(validurl.isWebUri(origUrl))
    {
        // console.log('hello');
        try {
            let url = await(Url.findOne({origUrl:origUrl}));
            if(url)
            {
                res.render('index.ejs',{base:process.env.BASE,
                    urlrecent:urlrecent,
                    urlmax:urlmax,
                    yes:1,
                    res:url.shortUrl
                });
            }
            else
            {
                const shortUrl=`${base}/${urlId}`;
                // console.log(shortUrl);
                const clicks=0;
                const urls=new Url({
                    urlId,
                    origUrl,
                    shortUrl,
                    clicks,
                    date: new Date()
                });
                await urls.save();
                const urlrecentafterpost= await Url.find({}).sort('-date').limit(10);
                const urlmaxafterpost= await Url.find({}).sort('-clicks').limit(10);
                res.render('index.ejs',{base:process.env.BASE,
                    urlrecent:urlrecentafterpost,
                    urlmax:urlmaxafterpost,
                    yes:1,
                    res:shortUrl
                });
            }
        } catch (error) {
            const message="Please try again";
            res.render('index.ejs',{base:process.env.BASE,
                urlrecent:urlrecent,
                urlmax:urlmax,
                yes:0,
                res:error
            });
        }
    }
    else
    {
        res.render('index.ejs',{base:process.env.BASE,
            urlrecent:urlrecent,
            urlmax:urlmax,
            yes:0,
            res:'enter url with http or https'
        });
    }


})

router.get('/',async(req,res)=>{

    // let query= await Url.find({});
    // console.log(query);
    const urlrecent= await Url.find({}).sort('-date').limit(10);
    const urlmax= await Url.find({}).sort('-clicks').limit(10);
    res.render('index.ejs',{
        base:process.env.BASE,
        yes:0,
        urlrecent:urlrecent,
        urlmax:urlmax,
        res:""
    });
})

router.get('/:id',async(req,res)=>{
    try{
        const id=req.params.id;
        const url=await Url.findOne({urlId:id});
        if(url)
        {
            url.clicks=url.clicks+1;
            await url.save();
            res.redirect(url.origUrl);
        }
        else
        {
            res.render('no_url.ejs');
        }
    }
    catch(error)
    {
        // console.log(error);
        res.send('Error occured')
    }
})

module.exports = router;