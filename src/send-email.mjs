import nodemailer from 'nodemailer'
import core from '@actions/core'
import * as dotenv from 'dotenv'
dotenv.config();

const textOnStatus = status => {
  let statusText
  let actionText
  
  switch (status) {
    case 'added':
      statusText = 'has a NEW item'
      actionText = 'happy seeding'
      break
    case 'removed':
      statusText = 'has an item REMOVED'
      actionText = 'you may stop seeding'
      break
    case 'empty':
      statusText = 'now EMPTY'
      actionText = 'you may stop seeding entirely'
      break
    default:
      statusText = ''
      actionText = ''
  }
  
  return { statusText, actionText }
}

const transformTitles = title => {
  let result = title.split("\n")
  
  return result.length === 1 && result[0].length === 0 ? [] : result
}

(async () => {
  const prevTitles = transformTitles(process.env.TITLES_PREV)
  const currTitles = transformTitles(process.env.TITLES_CURR)
  
  let status = null
  
  if (prevTitles.length < currTitles.length) {
    status = 'added'
  }
  if (prevTitles.length > currTitles.length && currTitles.length !== 0) {
    status = 'removed'
  }
  
  if (prevTitles.length > 0 && currTitles.length === 0) {
    status = 'empty'
  }
  
  const removed = prevTitles.filter(prev => !currTitles.includes(prev))
  
  let textParts = [
    `Hit'n'run list ${textOnStatus(status).statusText},`,
    `${textOnStatus(status).actionText}`
  ]
  
  if (status === 'removed') {
    textParts.push(`'${removed.length <= 1 ? removed[0] : removed.join('\', \'')}'`)
  }
  
  const text = `${textParts.join(' ')}!`
  
  const options = {
    from: `ncore hit'n'run sender <${process.env.EMAIL_SENDER_USER}>`,
    to: process.env.EMAIL_SENDER_RECIPIENT,
    subject: `ncore hit\'n\'run list ${textOnStatus(status).statusText}`,
    text,
    html: text
  }

  let transporter = nodemailer.createTransport({
    host: process.env.EMAIL_SENDER_HOST,
    secure: true,
    port: 465,
    auth: {
      user: process.env.EMAIL_SENDER_USER,
      pass: process.env.EMAIL_SENDER_PASSWORD
    }
  })

  if (status) {
    await transporter.sendMail(options, (error, info) => {
      if (error) {
        core.setFailed(error.message);
      } else {
        console.log(info)

        core.setOutput("info", info);
      }
    })
  } else {
    console.log('No email was sent')
    
    core.setOutput("result", 0);
  }
})()
