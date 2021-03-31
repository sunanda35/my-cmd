#!/usr/bin/env node


const fs = require('fs');
const jdata = require('./jdata.json');
const { spawn } = require('child_process');
const inq = require('inquirer');
const { version } = require('./package.json');


var argv = (process.argv.slice(2))

if(argv.length===0){
  help()
}else{
  try{
    switch(argv[0]){
      case "add":
        addCmd()
        break;
      case "update":
        updateCmd();
        break;
      case "all":
        showAllName();
        break;
      case "delete":
        deleteCmd()
        break;
      case "-h":
        help()
        break;
      case "-v":
        console.log(`App version: ${version}`)
        break;
      default:
        executeCmd(argv[0])
    }
  }catch(err){
    console.log(err)
  }
}
 
function help(){
  console.log('my add             to add new name with commands')
  console.log('my <command name>  to execute nameing command')
  console.log('my delete          to delete name with commands')
  console.log('my all             to see all executable command names with commands')
  console.log('my update          to update existing names with commands')
  console.log('my -h              to get help')
  console.log('my -v              to see version of this pakcage')
}
//help

function addCmd(){
  //create object
  var data = {
    "name": "fuck",
    "command":[]
  }
  
  var dataAdd = (data) =>{
    jdata.push(data)
   fs.writeFileSync('jdata.json', JSON.stringify(jdata))
   }

  inq.prompt([
    {
      type: "input",
      name: 'client',
      message: "What will be the name? "
    }
  ]).then(answer => {
    if(answer.client===""){
      console.log('You havn\'t give any name yet! fuck off ')
      return;
    }
    if(answer.client==="add" || answer.client==="all" || answer.client==="delete" || answer.client==="update" || answer.client==="-h" || answer.client==="-v"){
      console.log('Sorry! These are reserve command, Please use something else')
      return;
    }
      for(var i=0; i<jdata.length; i++){
        if(jdata[i].name===answer.client){
          console.log('You have already used this name. Plese use something else!')
          return;
        }
      }
    data.name=answer.client;
    console.log(data)
    var callCMD = async ()=>{
        while (true) {
        const answer = await inq.prompt([
          {
            type: "input",
            name: 'command',
            message: "Give executable command: "
          }
        ])
        data.command.push(answer)
        console.log(data)
        const nextAnswer = await inq.prompt([
          {
            type: "input",
            name: 'question',
            message: "Do you want to add more command?(y/n)"
          }
        ])
        if(nextAnswer.question!="y"){
          dataAdd(data)
          break
        }
        
      }
    }
    try{
      callCMD()
    }catch(err){
      console.log(err)
    }
    
  }).catch(error => {
    console.log(error)
  })
}
// addcmd

function updateCmd(){
  inq.prompt([
    {
      type: 'input',
      name: 'update_client',
      message: 'Which naming commands you want to change?'
    }
  ]).then(answer =>{
    if(answer.update_client==="add" || answer.update_client==="all" || answer.update_client==="delete" || answer.update_client==="update" || answer.update_client==="-h" || answer.update_client==="-v"){
      console.log('Sorry! These are reserve command, Please use something else')
      return;
    }
    for(var i=0; i<jdata.length; i++){
      if(jdata[i].name===answer.update_client){
        try{
          updateCmdName(i);
        }catch(err){
          console.log(err)
        }
        return;
      }
    }
    console.log('Sorry, This is not existing command. Please put some existing command!')
  }).catch(error =>{
    console.log(error)
  })
}

function updateCmdName(i){
  inq.prompt([
    {
      type: 'input',
      name: 'update',
      message: 'Which naming commands you want to change?'
    }
  ]).then(answer => {
    if(answer.update===''){
      console.log('Sorry, you have given empty string. Please try with valid name')
      return;
    }

    if(answer.update != jdata[i].name){
      jdata[i].name = answer.update
      fs.writeFileSync('jdata.json', JSON.stringify(jdata))
    }
  })
}
// updateCmdName

function executeCmd(commandName){
  for(var i=0; i<jdata.length; i++){
    if(jdata[i].name===commandName){
      cmdRun(i);
      console.log('Every command has been executed!')
      return;
    }
  }
  console.log('Sorry, this naming command not found. Plasae try again!')

}
//executeCmd
async function cmdRun(number) {
    for(var i=0;i<jdata[number].command.length;i++){
      var runcmd = await spawn(
      'sh',
      [
        '-c',
        `${jdata[number].command[i].command}`,
      ], {
          detached: true,
        stdio: ['inherit', 'inherit', 'inherit']
      }, 
      (error, stdout, stderr, exit) => {
      if(error){
          console.log(`Output of ${jdata[0].command[i].command}: ${error}`)
      }
      if(stdout){
          console.log(`Output of ${jdata[0].command[i].command}: ${stdout}`);
      }
      if(stderr){
          console.log(`Output of ${jdata[0].command[i].command}: ${stderr}`);
      }
    });
    runcmd.on('exit', (code) => {
      console.log(`child process exited with code ${code}`);
    });
}
}
//executeRun

function deleteCmd(){
  inq.prompt([
    {
      type: 'input',
      name:'nameofpacket',
      message: 'Which command packet you want to delete?'
    }
  ]).then(answer=>{
    if(answer.nameofpacket==="add" || answer.nameofpacket==="all" || answer.nameofpacket==="delete" || answer.nameofpacket==="update" || answer.nameofpacket==="-h" || answer.nameofpacket==="-v"){
      console.log('Sorry! These are reserve command, Please use something else')
      return;
    }
    console.log(answer.nameofpacket)
    for(var i=0;i<jdata.length;i++){
      if(jdata[i].name===answer.nameofpacket){
        jdata.splice(i,1)
        fs.writeFileSync('jdata.json', JSON.stringify(jdata))
        console.log(`Deleted this "${answer.nameofpacket}" name command packet`)
        return;
      }
    }
    console.log('Sorry there havn\'t any data packet by this name.')
  }).catch(error=>{
    console.log(error)
  })
}
//deleteCmd
function showAllName(){
  if(jdata.length==0){
    console.log('Sorry, you havn\'t saved any command. First add some command!')
    return;
  }
  for(var i=0; i<jdata.length; i++){
    console.log(`my ${jdata[i].name}:`)
    for(var cmd=0;cmd<jdata[i].command.length; cmd++){
      console.log(` --- ${jdata[i].command[cmd].command}`)
    }
    console.log(`\n`)
  }
}