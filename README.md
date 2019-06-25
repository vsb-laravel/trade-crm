# CRM trade system
## Install
Laravel CRM trade system. Using composer, add following to composer.json
<code>
...
"repositories":[
    {
        "type":"git",
        "url":"https://github.com/vsb-laravel/trade-crm"
    }
]
...
</code>
After
<p>
composer require vsb-laravel/trade-crm
</p>

## Setting up web socket
First of all, go to folder [install folder]/src
<code>
npm install
</code>
And start by command
<code>node web.socket/server.js</code>
or
add to <a href="http://supervisord.org/">supervisor</a> for background worker

## Setting up trade tick
First of all, go to folder [install folder]/src
<code>
npm install
</code>
And start by command
<code>node trade.center/client.js</code>
or
add to <a href="http://supervisord.org/">supervisor</a> for background worker
<p>
It has default config file [install folder]/src/trade.center/config.index.js
