import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ProductList from "@/features/product/components/product-list";

const Collection = () => {
  return (
    <div id="collection" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <Card className="max-w-7xl mx-auto">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center">Bộ Sưu Tập</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose max-w-none mb-8">
              <p className="text-gray-600 text-center">
                Khám phá bộ sưu tập sản phẩm độc đáo của chúng tôi, được thiết kế để tạo nên không gian học tập 
                hoàn hảo cho bạn.
              </p>
            </div>
            
            {/* Product List Component */}
            <ProductList />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Collection;
