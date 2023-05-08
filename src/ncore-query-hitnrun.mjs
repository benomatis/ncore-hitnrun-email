import createNcoreApi from 'ncore-api'
import core from '@actions/core'
import * as dotenv from 'dotenv'
dotenv.config();

(async () => {
  try {
    const ncoreApi = await createNcoreApi({
      username: process.env.NCORE_USERNAME,
      password: process.env.NCORE_PASSWORD,
    });
    
    const result = await ncoreApi.getHitNRun()
    
    console.log(result)

    core.setOutput("titles", result.map(r => r.title).join("\n"))
  } catch (error) {
    core.setFailed(error.message)
  }
})()