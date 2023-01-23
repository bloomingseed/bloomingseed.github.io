---
layout: default
---
{% for category in site.data.nav_data.categories %}
## {{ category.title }}
  {% for post in category.posts %}
- [{{ post }}](/{{ category.title }}/{{ post }}.html)
  {% endfor %}
{% endfor %}
