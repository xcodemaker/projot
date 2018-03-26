if(process.env.NODE_ENV==='production'){
    module.exports={mongoURI:'mongodb://dhammikadsk:dhammika12345@ds123919.mlab.com:23919/vidjot-prod'}
}else{
module.exports={mongoURI:'mongodb://localhost/vidjot-dev'}
}