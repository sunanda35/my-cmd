#!/usr/bin/env node


const fs = require('fs');
const jdata = require('./jdata.json');
const { spawn } = require('child_process');
const inq = require('inquirer');

const { version } = require('./package.json')


var argv = (process.argv.slice(2))

if(argv.length===0){
  console.log('what you want to do baby?')
}else{
  try{
    switch(argv[0]){
      case "add":
        addCmd()
        break;
      case "all":
        console.log('It will show you all command you have saved')
        break;
      case "delete":
        deleteCmd()
        break;
      case "-h":
        console.log('we can\'t help you buddy')
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
    if(answer.client==="add" || answer.client==="all" || answer.client==="delete" || answer.client==="update"){
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
      message: 'Which data packet you want to delete?'
    }
  ]).then(answer=>{
    console.log(answer.nameofpacket)
    for(var i=0;i<jdata.length;i++){
      if(jdata[i].name===answer.nameofpacket){
        jdata.splice(i,1)
        fs.writeFileSync('jdata.json', JSON.stringify(jdata))
        console.log(`Deleted this ${answer.nameofpacket} packet`)
        return;
      }
    }
    console.log('Sorry there havn\'t any data packet by this name.')
  }).catch(error=>{
    console.log(error)
  })
}