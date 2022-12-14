import { spawn } from 'node:child_process'

import {
  TCP_SERVER_HOST,
  TCP_SERVER_PORT,
  IS_DEVELOPMENT_ENV,
  LANG as LEON_LANG,
  TCP_SERVER_BIN_PATH
} from '@/constants'
import { LangHelper } from '@/helpers/lang-helper'
import TcpClient from '@/core/tcp-client'
import server from '@/core/http-server/server'
;(async (): Promise<void> => {
  process.title = 'leon'

  global.tcpServerProcess = spawn(
    `${TCP_SERVER_BIN_PATH} ${LangHelper.getShortCode(LEON_LANG)}`,
    {
      shell: true,
      detached: IS_DEVELOPMENT_ENV
    }
  )

  global.tcpClient = new TcpClient(TCP_SERVER_HOST, TCP_SERVER_PORT)

  await server.init()
})()
