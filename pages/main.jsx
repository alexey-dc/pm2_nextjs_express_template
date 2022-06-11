import React from 'react'
import Layout from '../view/layout.jsx'

export default function Main(props) {
  return <Layout>
    <h1> PM2 + NextJS + ExpressJS demo </h1>
    <p>
      This is a slightly less barebones version of <a target="_blank" href="https://github.com/alexey-dc/nextjs_express_template">nextjs_express_template</a>.
    </p>
    <p>
      It makes some more opinionated choices:
    </p>
    <ul style={{marginLeft: "2vw"}}>
      <li> Relying on <a href="https://pm2.keymetrics.io/">pm2</a> as the launcher, so rolling zero-downtime deploys via cluster mode are possible</li>
      <li> It pulls in <a href="https://www.npmjs.com/package/log4js">log4js</a> - since it's tricky to integrate logging with pm2</li>
      <li> It makes an opinionated choice on launch setup for global functionality (e.g. database connections) </li>
    </ul> 
    <p>
      See <a href="https://dev.to/alexeydc/express-nextjs-sample-tutorial-integration-485f">this article</a> that explains the underlying server structure and motivation.
    </p>
    <p>
      This project inherits all the original functionality, including the examples below.
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
