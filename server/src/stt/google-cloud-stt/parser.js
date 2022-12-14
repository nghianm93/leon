import path from 'node:path'

import stt from '@google-cloud/speech'

import { LANG } from '@/constants'
import { LogHelper } from '@/helpers/log-helper'

LogHelper.title('Google Cloud STT Parser')

const parser = {}
let client = {}

parser.conf = {
  languageCode: LANG,
  encoding: 'LINEAR16',
  sampleRateHertz: 16000
}

/**
 * Initialize Google Cloud Speech-to-Text based on the credentials in the JSON file
 * the env variable "GOOGLE_APPLICATION_CREDENTIALS" provides the JSON file path
 */
parser.init = () => {
  process.env.GOOGLE_APPLICATION_CREDENTIALS = path.join(
    process.cwd(),
    'core/config/voice/google-cloud.json'
  )

  try {
    client = new stt.SpeechClient()

    LogHelper.success('Parser initialized')
  } catch (e) {
    LogHelper.error(`Google Cloud STT: ${e}`)
  }
}

/**
 * Read buffer and give back a string
 */
parser.parse = async (buffer, cb) => {
  const audioBytes = buffer.toString('base64')
  const audio = { content: audioBytes }

  try {
    const res = await client.recognize({
      audio,
      config: parser.conf
    })
    const string = res[0].results
      .map((data) => data.alternatives[0].transcript)
      .join('\n')

    cb({ string })
  } catch (e) {
    LogHelper.error(`Google Cloud STT: ${e}`)
  }
}

export default parser
