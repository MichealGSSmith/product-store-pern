import React from 'react'

function ProductCard({product}) {
  return (
    <div className='card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow duration-300'>
        {/*Product Image*/}
        <figure className='relative pt-[56.25%]'>
            <img
                src={product.image}
                alt={product.name}
                className='absolute top-0 left-0 w-full h-full object-cover'
            />
        </figure>
    </div>
  )
}

export default ProductCard;
