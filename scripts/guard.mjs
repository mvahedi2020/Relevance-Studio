import { execFileSync } from 'node:child_process'
import { readdirSync } from 'node:fs'
const tracked = execFileSync('git', ['ls-files'], { encoding: 'utf8' }).split('\n')
const forbidden = /(^|\/)(\.env($|\.)|\.next\/|\.vercel\/|node_modules\/|dist\/|test-results\/|playwright-report\/)/
if (tracked.some(path => forbidden.test(path) && !path.endsWith('.env.example'))) throw new Error('Tracked runtime or environment files are forbidden')
if (readdirSync('.').some(path => /^\.env($|\.)/.test(path) && path !== '.env.example')) throw new Error('This static sample needs no local credentials')
