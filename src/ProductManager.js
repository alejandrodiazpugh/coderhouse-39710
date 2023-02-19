import fs from 'fs'
class ProductManager {
    /**
     * @param {string} path - The path to the json or txt file containing the products.
     */
    constructor(path) {
        this.path = path
    }

    /**
     * @param {{title: string, description: string, price: number, thumbnail: string, code: string, stock: number }} product - The Product to be added, with its corresponding data attributes.
     */
    async addProduct(product) {
        /**
         * @param {Array} list - Any list that needs to add an auto increment id.
         */
        // ID autoincrementable - devuelve un numero
        function generateId(list) {
            /** @type {number} */
            let id
            if (list.length === 0) {
                id = 1
            } else {
                //En caso de que se vayan borrando productos, evita que se repitan ids.
                id = list[list.length - 1].id + 1
            }
            return id
        }
        try {
            const products = await this.getProducts()
            //Revisa que product tenga todas las propiedades
            const productKeys = Object.keys(product)
            const mandatoryFields = [
                'title',
                'description',
                'price',
                'thumbnail',
                'code',
                'stock'
            ]
            const validateFields = mandatoryFields.every((field) =>
                productKeys.includes(field)
            )
            if (!validateFields) {
                throw new Error('Product missing properties')
            }

            // Revisa que no se repita el mismo codigo en los productos
            for (const entry of products) {
                if (entry.code.toUpperCase() === product.code.toUpperCase()) {
                    throw new Error('Product Code already exists')
                }
            }

            /** @type {number} - Generated id  */
            const id = generateId(products)
            const productWithId = { ...product, id }
            products.push(productWithId)
            await fs.promises.writeFile(this.path, JSON.stringify(products))
        } catch (err) {
            console.error(`Error while adding product: ${err} `)
        }
    }

    async getProducts() {
        const products = await fs.promises.readFile(this.path, 'utf-8')
        return JSON.parse(products)
    }

    /**
     * @param {number} id
     */
    async getProductById(id) {
        try {
            const products = await this.getProducts()
            const productToFind = products.find((product) => product.id === id)
            if (!productToFind) {
                throw new Error('Product not found')
            }
            return productToFind
        } catch (err) {
            console.error(`Error while finding product: ${err}`)
        }
    }

    /**
     * @param {number} id
     * @param {{title?: string, description?: string, price?: number, thumbnail?: string, code?: string, stock?: number }} updatedProduct - The Product to be added, only add the keys that are to be changed.
     */
    async updateProduct(id, updatedProduct) {
        try {
            const products = await this.getProducts()
            const product = await this.getProductById(id)
            if (!product) {
                throw new Error(`No product matches id ${id}.`)
            }
            const indexOfProduct = products.findIndex(
                (element) => element.id === id
            )
            // actualiza solamente los campos que se enviaron en el argumento updatedProduct, si no se provee, usa el valor original del producto
            for (const [key, value] of Object.entries(product)) {
                product[key] = updatedProduct[key] || value
            }
            // Reinserta el producto actualizado al arreglo de productos
            products.splice(indexOfProduct, 1, product)
            fs.promises.writeFile(this.path, JSON.stringify(products))
            return `Product successfully updated: ${product}`
        } catch (err) {
            console.error(`Error while updating product: ${err}`)
        }
    }

    /**
     * @param {number} id - The id number to delete from the product list.
     */
    async deleteProduct(id) {
        try {
            const products = await this.getProducts()
            const product = await this.getProductById(id)
            if (!product) {
                throw new Error(`No product matches id ${id}.`)
            }
            const indexOfProduct = products.findIndex(
                (element) => element.id === id
            )
            products.splice(indexOfProduct, 1)
            fs.promises.writeFile(this.path, JSON.stringify(products))
            return `Product successfully deleted: ${product}`
        } catch (err) {
            console.error(`Error while deleting product: ${err}`)
        }
    }
}

const testProduct = new ProductManager('./src/data/products.txt')
await testProduct.addProduct({
    title: 'Mistborn',
    description: 'libro',
    price: 399,
    thumbnail: 'no',
    code: 'SAN123',
    stock: 20
})
await testProduct.addProduct({
    title: 'The way of kings',
    description: 'libro',
    price: 499,
    thumbnail: 'no',
    code: 'SAN456',
    stock: 30
})
console.log(await testProduct.getProducts())
await testProduct.updateProduct(1, { title: 'Mistborn, The Final Empire' })
console.log(await testProduct.getProducts())
await testProduct.deleteProduct(1)
console.log(await testProduct.getProducts())
