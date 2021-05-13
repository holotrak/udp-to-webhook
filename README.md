# Losant - UDP to Webhook

This application can be used as a proxy to forward incoming UDP messages to a 
Losant Webhook or Experience Endpoint.

## Configuration

Configuration of the application is done through the following environment variables:

| Env Var  	      |  Required 	|  Description  |
|---      	      |---	        |---          	|
| CONTENT_TYPE  	|  N 	        | Content type of the data posted to the webhook (default: application/octet-stream)  |
| BASIC_USERNAME  |  N 	        | Basic auth username used for webhook authentication  |
| BASIC_PASSWORD  |  N 	        | Basic auth password used for webhook authentication  |
| PORT_MAP_*      |  Y 	        | Maps a udp port to a webhook. For example the var `PORT_MAP_9000` with the value `https://triggers.losant.com/webhooks/123456` will send data received on port `9000` to `https://triggers.losant.com/webhooks/123456`. At least on port map must be provided.  |

## Usage

To install application dependencies:

```
yarn
```

To run the application:

```
node main
```