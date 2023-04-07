const express    = require('express')
const puppeteer  =  require('puppeteer');
const path       = require('path'); 
const crypto     = require('crypto');
const csvdb      = require('csv-database');
const XLSX       = require("xlsx");
const app        = express();
const port       = 4696;
const bodyParser = require('body-parser');
const multer     = require('multer');
var urlSkrg      = '';
var flowKe       = 0;
var data_flow    = [];
var browser      = '';
var storage      = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname) //Appending extension
  }
})

var upload = multer({ storage: storage });

(async ()=>{
  
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());

  const label   = await csvdb("db/label.csv", ["id","nama","url","file"]);
  const element = await csvdb("db/element.csv", ["id","id_label","elm","aksi","database"]);
  const flow    = await csvdb("db/flow.csv", ["id","nama","id_label","aktif"]);

  app.use('/static', express.static(path.join(__dirname, 'public')))

  app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, '/index.html'));
  });

  app.get('/mulai-flow/:id', async function(req, res) {
       const id = req.params.id;
	   var allLabel = await flow.get({id:id});
	   
	   browser = await puppeteer.launch({
			  headless:false,  
			  userDataDir: "./user_data"

			});
			
		data_flow = allLabel[0]['id_label'].split(",");
		mulai();
	    res.json(allLabel)
		
	  
  });
  
  app.post('/simpan-label', upload.single('file'), async function(req, res) {
    var id = crypto.randomBytes(32).toString('hex');
    var file = "";
    if(req.file){
      file = req.file.originalname;
    }
    var data =  await label.add([{id: id, nama: req.body.nama, url: req.body.url,file:file}]);
    console.log(data)
    res.json({"code":"sukses","msg":id})
  });

  app.post('/simpan-element', async function(req, res) {
    var idE = crypto.randomBytes(32).toString('hex');

    await element.add([{
          id:idE,
          id_label: req.body.id, 
          elm: req.body.elm, 
          aksi: req.body.aksi_elm,
          database: req.body.db
        }]);
    res.json({"code":"sukses"})
  });

  app.get('/label', async function(req, res) {
    var allLabel = await label.get();
    res.json(allLabel)
  });

  app.get('/element/:id', async function(req, res) {
    const id = req.params.id;
    var allElmt = await element.get({id_label: id});
    res.json(allElmt)
  });

  app.get('/element-detail/:id', async function(req, res) {
    const id = req.params.id;
    var allElmt = await element.get({id: id});
    res.json(allElmt)
  });

  app.post('/edit-element/:id', async function(req, res) {
    const id = req.params.id;
      data = await element.edit({
        id:id
      },{
        elm: req.body.elm, 
        aksi: req.body.aksi_elm,
        database: req.body.db
      });
      res.json({"code":"sukses"})
  });

  app.post('/edit-label/:id', upload.single('file'), async function(req, res) {
    const id = req.params.id;
    console.log(id)
    if(req.file){
      const file = req.file.originalname;
      data = await label.edit({
        id:id
      },{
        nama: req.body.nama, 
        url: req.body.url,
        file: file
      });
    }else{
      data = await label.edit({
        id:id
      },{
        nama: req.body.nama, 
        url: req.body.url
      });
    }

    console.log(data)
    
    res.json({"code":"sukses"})
  });

  app.get('/label/:id', async function(req, res) {
    const id = req.params.id;
    var allLabel = await label.get({id: id});
    res.json(allLabel)
  });

  app.delete('/label/:id', async function(req, res) {
    const id = req.params.id;
    if(id !== ""){
      await label.delete({id: id});
    }
    res.json({code:"sukses",msg:"berhasil dihapus"})
  });

  app.delete('/element/:id', async function(req, res) {
    const id = req.params.id;
    if(id !== ""){
      await element.delete({id: id});
    }
    res.json({code:"sukses",msg:"berhasil dihapus"})
  });
    
  app.get('/record', async function(req, res) {
      if(req.query.url){
          
          const browser = await puppeteer.launch({headless:false});
          const page = await browser.newPage();
          await page.goto(req.query.url);
      
          // Set screen size
          await page.setViewport({width: 1080, height: 1024});
      }

    
  });

  app.post('/simpan-flow', async function(req, res) {
      var id = crypto.randomBytes(32).toString('hex');

      await flow.add({
        id       : id, 
        nama     : req.body.label,
        id_label : req.body.label_value,
        aktif    : 1
      });

      res.json({"code":"sukses"})
  })

  app.get('/flow', async function(req, res) {
    var allLabel = await flow.get();
    res.json(allLabel)
  })

  app.get('/flow/:id', async function(req, res) {
    const id = req.params.id;
    var allLabel = await flow.get({id:id});
    res.json(allLabel)
  })

  app.post('/edit-flow/:id', async function(req, res) {
    const id = req.params.id;

    await flow.edit({id:id},
      {
      nama     : req.body.label,
      id_label : req.body.label_value,
      aktif    : req.body.aktif
    });

    res.json({code:"sukses",msg:"berhasil dihapus"})
  })

  app.delete('/flow/:id', async function(req, res) {
    const id = req.params.id;
    if(id !== ""){
      await flow.delete({id: id});
    }
    res.json({code:"sukses",msg:"berhasil dihapus"})
  })

  app.listen(port, () => {
    console.log(`Berjalan diport ${port}`)
  })


  // --------------------------- fungsi 
  async function mulai(){
	  if(data_flow.length > flowKe){  
		action_browser(data_flow[flowKe]); 
	  }else{
		flowKe = 0;
		await browser.close();
	  }
  }
	
  async function action_browser(id = null){
    var data       = await label.get({id:id});
    var elem       = await element.get({id_label:id});
    var data_excel = [];
	
    if(data[0]){

        if(data[0]['file']){ 
          var workbook = XLSX.readFile('uploads/'+data[0]['file']);
          var sheet_name_list = workbook.SheetNames;
          data_excel = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
        }
		
		var page = await browser.newPage();

		urlSkrg = data[0].url;
        await page.goto(data[0].url);
        await page.setViewport({width: 1080, height: 1024});
        pecah_data(page, elem,data_excel,ke=0);
		
    }else{
		console.log("data tidak ditemukan")
	}


 
  }
  
  async function pecah_data(page, params ,data_excel , ke = 0 , flowke = 0){

    if(data_excel.length > ke){
     await elementGo(page,params,data_excel,data_excel[ke],0,ke);
    }else{
		flowKe++;
		mulai()
    }
	
  }  

  async function elementGo(page,params,data_excel,data ,ke = 0 , datake) {

    if(params.length > ke){
      switch (params[ke]['aksi']) {
        case "Input":
          await page.waitForTimeout(500)
          await page.waitForSelector(params[ke]['elm'],  {visible: true});
          await page.type(params[ke]['elm'],""+data[params[ke]['database']]);
          break;
      case "Input & Enter":
         await page.waitForTimeout(500)
          await page.waitForSelector(params[ke]['elm'],  {visible: true});
          await page.type(params[ke]['elm'],data[params[ke]['database']]);
          await page.waitForTimeout(1000)
          await page.keyboard.press('Enter'); // Enter Key
          break;
      case "Pilihan Dropdown":
          await page.waitForTimeout(500)
          await page.waitForSelector(params[ke]['elm'],  {visible: true});
          await page.select(params[ke]['elm'],  data[params[ke]['database']])
          break;
      case "Pilihan Tunggal":
          await page.waitForTimeout(500)
          await page.waitForSelector(params[ke]['elm'],  {visible: true});
          await page.click(`input[type=radio][value='${data[params[ke]['database']]}']`);
          break;
      case "Upload File":
		 if(data[params[ke]['database']]){
			  
			await page.waitForTimeout(500)
			await page.waitForSelector(params[ke]['elm'],  {visible: true});
			const input = await page.$(params[ke]['elm']);
			await input.uploadFile(data[params[ke]['database']]);
		  }
		
		break;
      case "Klik":
        await page.waitForTimeout(500)
    	await page.waitForSelector(params[ke]['elm'],  {visible: true});
		await page.$eval(params[ke]['elm'], el => el.removeAttribute("target"));	
		await Promise.all([
			page.click(params[ke]['elm']),
			page.waitForNavigation({waitUntil: 'networkidle2'})
		]);
		
        default: 
          break;
      }

      ke++;
      await page.waitForTimeout(500)
      elementGo(page,params,data_excel,data,ke,datake);
    }else{
      datake++;
      await page.waitForTimeout(500)        
	  await page.goto(urlSkrg);
      pecah_data(page,params,data_excel,datake)
    }

  }
  
 
})()