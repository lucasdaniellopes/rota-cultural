from scalar_doc import ScalarDoc
from django.http import HttpResponse

def scalar_docs(request):
    schema_url = request.build_absolute_uri('/api/schema/')
    docs = ScalarDoc.from_spec(schema_url, mode='url')
    docs.set_title("Rota Cultural API")
    return HttpResponse(docs.to_html(), content_type='text/html')
