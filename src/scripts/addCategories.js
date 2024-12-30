import { db } from '../firebase'
    import { collection, addDoc } from 'firebase/firestore'

    const addCategories = async () => {
      const categories = [
        { name: 'Atta', totalStock: 0 },
        { name: 'Maida', totalStock: 0 },
        { name: 'Dal', totalStock: 0 }
      ]

      try {
        for (const category of categories) {
          await addDoc(collection(db, 'categories'), category)
        }
        console.log('Categories added successfully!')
      } catch (error) {
        console.error('Error adding categories:', error)
      }
    }

    addCategories()
