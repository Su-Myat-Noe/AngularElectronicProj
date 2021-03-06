import { CartService, BaseCartItem } from 'ng-shopping-cart';
import { ShoppingCartService } from './../services/cart.service';
// import { ShoppingCartService } from './../services/shopping-cart.service';
import { Brand } from './../services/model/brand';
import { Category } from './../services/model/category';
import { Product } from './../services/model/product';
import { RestApiService } from 'src/app/services/rest-api.service';
import { Component, OnInit } from '@angular/core';
declare let $: any;
@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.css']
})
export class ShopComponent implements OnInit {
  products: Product[] = [];
  productDesc:Product[]=[];
  categories:Category[]=[]; 
  brands:Brand[]=[];
  cart=[];
  loading: any;
  productcart: Product;

  constructor(
    private rest: RestApiService,
    private shoppingCart: ShoppingCartService,    
    private cartService: CartService<BaseCartItem>) {

    this.getProducts();
    this.getProductdesc();  
    this.getCategorylimit();
    this.getshopBrand();

  }
  
  //  addToCart(products){
  //   for(var i in this.cart){
  //     if(this.cart[i][0]===products){
  //       this.cart[i][1]++;
  //       console.log(this.cart);
  //       return;
  //     }
  //   }
  //   let item=[products,1];
  //   this.cart.push(item);
  //   console.log(this.cart);
  // }
  getProducts() {
    this.rest.getProducts()
      .subscribe(res => {
        console.log(res);
        this.products = res;
        new Promise((resolve) => {
          this.loadScript('recommended-product');
          resolve(true);           
        });
      });
  }
  getProductdesc() {
    this.rest.getProductDesc()
      .subscribe(res => {
        console.log(res);
        this.productDesc = res;
        new Promise((resolve) => {
          this.loadScript('recommended-product');
          resolve(true);           
        });
      });
  }
  getCategorylimit() {
    this.rest.getCategorylimit()
        .subscribe(res => {
          console.log(res);
          this.categories = res;
          new Promise((resolve) => {
            this.loadScript('recommended-product');
            resolve(true);           
          });
        });
  }
  getshopBrand(){
    this.rest.getshopBrand()
        .subscribe(res => {
          console.log(res);
          this.brands = res;
          new Promise((resolve) => {
            this.loadScript('recommended-product');
            resolve(true);           
          });
        });
  } 

  addToCart(id) {
    var detail = [];
    
    this.loading = true;
    this.rest.getProductDetail(id)
        .subscribe(results => {
            this.loading = false;
            this.productcart = results;
            detail = this.productcart.productdetail;
            const item = new BaseCartItem();
            item.setId(this.productcart.id);
            item.setName(this.productcart.name);
            item.setPrice(detail[0].price);
            item.setQuantity(1);
            item.setImage(this.productcart.image);
            this.cartService.addItem(item);
            this.shoppingCart.changedCartService$.next(true);
        });
}
  ngOnInit() {

  }

  public loadScript(script: string = 'electro') {
    var isFound = false;
    var scripts = document.getElementsByTagName("script")
    for (var i = 0; i < scripts.length; ++i) {
      if (scripts[i].getAttribute('src') != null && scripts[i].getAttribute('src').includes(script)) {
        isFound = true;
      }
    }

    if (!isFound) {
      var dynamicScripts = ["../assets/js/"+script+".js"];
      for (var i = 0; i < dynamicScripts.length; i++) {
        let node = document.createElement('script');
        node.src = dynamicScripts[i];
        node.type = 'text/javascript';
        node.async = false;
        node.charset = 'utf-8';
        document.getElementsByTagName('header')[0].appendChild(node);
      }
    }
  }

}
