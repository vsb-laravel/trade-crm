# CRM trade system
## Install
Laravel CRM trade system.
<p>Using composer add following to composer.json:</p>
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
<p>
After:
</p>
<p>
<code>composer require vsb-laravel/trade-crm</code>
</p>

## Setting up web socket
First of all, go to folder
<p>[install folder]/src</p>
<p>
<code>
npm install
</code>
</p>
<p>
And start by command
</p>
<p>
<code>node web.socket/server.js</code>
</p>
<p>
or
</p>
<p>
add to <a href="http://supervisord.org/">supervisor</a> for background worker
</p>

## Setting up trade tick
First of all, go to folder
<p>[install folder]/src
<code>
npm install
</code>
</p>
<p>
And start by command
</p>
<p>
<code>node trade.center/client.js</code>
</p>
<p>
or
</p>
<p>
add to <a href="http://supervisord.org/">supervisor</a> for background worker
</p>
<p>
It has default config file
</p>
<p>[install folder]/src/trade.center/config.index.js</p>
