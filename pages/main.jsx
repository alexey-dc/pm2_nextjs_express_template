import React from 'react'
import Layout from '../view/layout.jsx'

export default function Main(props) {
  return <Layout>
    <h1> PM2 + NextJS + ExpressJS demo </h1>
    <a target="_blank" href="https://github.com/alexey-dc/pm2_nextjs_express_template">GitHub page</a>
    <p>
      This is a slightly less barebones version of <a target="_blank" href="https://github.com/alexey-dc/nextjs_express_template">nextjs_express_template</a>.
    </p>
    <p>
      It makes some more opinionated choices:
    </p>
    <ul style={{marginLeft: "2vw"}}>
      <li> Relying on <a target="_blank" href="https://pm2.keymetrics.io/">pm2</a> as the launcher, so <a target="_blank" href="https://pm2.keymetrics.io/docs/usage/cluster-mode/">rolling zero-downtime deploys via cluster mode</a> are possible</li>
      <li> It pulls in <a target="_blank" href="https://www.npmjs.com/package/log4js">log4js</a> - since it's tricky to integrate logging with pm2</li>
      <li> It makes an opinionated choice on launch setup for global functionality (e.g. database connections) </li>
    </ul> 
    <p>
      I've published <a target="_blank" href="https://dev.to/alexeydc/pm2-express-nextjs-with-github-source-zero-downtime-deploys-n71">an article</a> explaining some of the features of this deployment with PM2.
    </p>
    <p>
      See <a target="_blank" href="https://dev.to/alexeydc/express-nextjs-sample-tutorial-integration-485f">this article</a> that explains the underlying NextJS+Express server structure and motivation.
    </p>
    <p>
      This project shares all functionality with the basic NextJS+Express article - the only difference is the way it is launched, so a production-grade zero-downtime deploy process is possible.
    </p>
    <p>
      The examples below showcase some common applications of a NextJS+Express setup.
    </p>
    <div style={{marginBottom: "4vh"}}/>
    <ul className='large_li'>
      <li> <a href="/preload_data"> Preloading data into pages </a> </li>
      <li> <a href="/load_data_via_api"> Loading data after page load </a> </li>
      <li> <a href="/large_or_small/5"> Special routing </a> </li>
      <li> <a href="/nextjs_default_routing"> Default/fallback NextJS routing </a> </li>
    </ul>
  </Layout>
}
