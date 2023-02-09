class ProductManager {
	constructor() {
		this.products = [];
	}

	/**
	 * @param {Object} product
	 */
	addProduct(product) {
		/**
		 * @param {Array} list
		 */
		// ID autoincrementable
		function generateId(list) {
			let id;
			if (list.length === 0) {
				id = 1;
			} else {
				//En caso de que se vayan borrando productos, evita que se repitan ids.
				id = list[list.length - 1].id + 1;
			}
			return id;
		}
		try {
			//Revisa que product tenga todas las propiedades
			const productKeys = Object.keys(product);
			const mandatoryFields = [
				'title',
				'description',
				'price',
				'thumbnail',
				'code',
				'stock',
			];
			const validateFields = mandatoryFields.every((field) =>
				productKeys.includes(field)
			);
			if (!validateFields) {
				throw new Error('Product missing properties');
			}

			// Revisa que no se repita el mismo codigo en los productos
			for (const entry of this.products) {
				if (entry.code.toUpperCase() === product.code.toUpperCase()) {
					throw new Error('Product Code already exists');
				}
			}

			const id = generateId(this.products);
			const productWithId = { ...product, id };
			this.products.push(productWithId);
		} catch (err) {
			console.error(`Error while adding product: ${err} `);
		}
	}

	getProducts() {
		console.log(this.products);
		return this.products;
	}

	/**
	 * @param {number} id
	 */
	getProductById(id) {
		try {
			const productToFind = this.products.find(
				(product) => product.id === id
			);
			if (!productToFind) {
				throw new Error('Product not found');
			}
			console.log(productToFind);
			return productToFind;
		} catch (err) {
			console.error(`Error while finding product: ${err}`);
		}
	}
}
