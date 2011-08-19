$(function(){

  window.Product = Backbone.Model.extend({
    defaults: { name: 'name missing' },
    urlRoot: '/products'
  });

  window.ProductsList = Backbone.Collection.extend({
    model: Product,
    url: '/products'
  });

  window.ProductViewForListing = Backbone.View.extend({
    template: $('#productTmplForListing').template(),
    initialize: function() {
      _.bindAll(this, 'render');
    },
    className: 'product',
    render: function(){
      var fragment = $.tmpl(this.template, this.model.toJSON());
      $(this.el).html(fragment);
      return this;
    }
  });

  window.ProductViewForShow = Backbone.View.extend({
    template: $('#productTmplForShow').template(),
    className: 'gallery',
    initialize: function(){
      _.bindAll(this, 'render');
      this.render();
    },
    render: function(){
      var fragment = $.tmpl(this.template, this.model.toJSON());
      $(this.el).html(fragment);
      return this;
    },
    events: {
      "click #productDetails a": "addToCart"
    },
    addToCart: function(){
      alert('adding to cart');
    }
  });

  window.HeaderViewForPage = Backbone.View.extend({
    template: $('#headerTmplForPage').template(),
    id: 'header',
    initialize: function(){
      _.bindAll(this, 'render');
    },
    render: function(){
      var fragment = $.tmpl(this.template);
      $(this.el).html(fragment);
      return this;
    }
  });

  window.AppView = Backbone.View.extend({
    el: $('#products'),
    initialize: function(){
      _.bindAll(this, 'render', 'showProduct');
    },
    renderHeader: function(){
      $('#header').remove();
      var _view = new HeaderViewForPage({}), _fragment = _view.render().el;
      $('#container').prepend(_fragment);
    },
    render: function(){
      this.renderHeader();

      $('.gallery').remove();
      var targetElement = $('#products');
      var self = this;
      this.collection.each(function(product){
        var view = new ProductViewForListing({model: product}),
            fragment = view.render().el;
        self.el.append(fragment);
      });
    },
    showProduct: function(id){
      this.renderHeader();

      var product = new Product({id: id}), self = this;
      product.fetch({
        success: function(){
          var mainElement = self.el.closest('#main'),
              view = new ProductViewForShow({model: product});
          mainElement.find('#products').html('');
          self.el.append(view.render().el);
        },
        error: function(){ alert('error getting product details'); }
      });
      return false;
    }
  });

  window.products = new ProductsList();

  window.AppRouter = Backbone.Router.extend({
    initialize: function(){
    },
    routes: {
      '': 'home',
      'products/:id': 'showProduct'
    },
    home: function(){
      var self = this;
      window.products.fetch({
        success: function(){
          self.appView = new AppView({ collection: window.products });
          self.appView.render();
        }
      });
    },
    showProduct: function(id){
      self.appView = new AppView({ collection: {} });
      self.appView.showProduct(id);
    }
  });

  window.App = new window.AppRouter();
  Backbone.history.start({pushState: false});

});
