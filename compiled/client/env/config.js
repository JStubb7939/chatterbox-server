// All this is doing is inserting the parse API keys into every $.ajax
// request that you make so you don't have to.

// $.ajaxPrefilter(function (settings, _, jqXHR) {
// // (also, the server URL should start with `http://parse.hrr.hackreactor.com`
//   jqXHR.setRequestHeader('X-Parse-Application-Id', '2ef3d2c5e858caa0f408245343948b1473cac982');
//   jqXHR.setRequestHeader('X-Parse-REST-API-Key', 'c4585920fd5f002e861bcb48a7f9a61f8893ee43');
// });
"use strict";
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NsaWVudC9lbnYvY29uZmlnLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJjb25maWcuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBBbGwgdGhpcyBpcyBkb2luZyBpcyBpbnNlcnRpbmcgdGhlIHBhcnNlIEFQSSBrZXlzIGludG8gZXZlcnkgJC5hamF4XG4vLyByZXF1ZXN0IHRoYXQgeW91IG1ha2Ugc28geW91IGRvbid0IGhhdmUgdG8uXG5cbi8vICQuYWpheFByZWZpbHRlcihmdW5jdGlvbiAoc2V0dGluZ3MsIF8sIGpxWEhSKSB7XG4vLyAvLyAoYWxzbywgdGhlIHNlcnZlciBVUkwgc2hvdWxkIHN0YXJ0IHdpdGggYGh0dHA6Ly9wYXJzZS5ocnIuaGFja3JlYWN0b3IuY29tYFxuLy8gICBqcVhIUi5zZXRSZXF1ZXN0SGVhZGVyKCdYLVBhcnNlLUFwcGxpY2F0aW9uLUlkJywgJzJlZjNkMmM1ZTg1OGNhYTBmNDA4MjQ1MzQzOTQ4YjE0NzNjYWM5ODInKTtcbi8vICAganFYSFIuc2V0UmVxdWVzdEhlYWRlcignWC1QYXJzZS1SRVNULUFQSS1LZXknLCAnYzQ1ODU5MjBmZDVmMDAyZTg2MWJjYjQ4YTdmOWE2MWY4ODkzZWU0MycpO1xuLy8gfSk7XG4iXX0=