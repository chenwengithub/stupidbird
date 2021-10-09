import json

from app.service.camera import live, connect, reconnect, hide, status, catch, release


def action(request):
    if request.method == 'POST':
        body = json.loads(request.body)
        method = body['method']
        if method == 'live':
            return live()
        elif method == 'connect':
            return connect()
        elif method == 'reconnect':
            return reconnect()
        elif method == 'status':
            return status()
        elif method == 'hide':
            return hide()
        elif method == 'catch':
            return catch(body['key'])
        elif method == 'release':
            return release()
