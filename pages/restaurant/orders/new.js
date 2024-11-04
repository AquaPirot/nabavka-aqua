// pages/restaurant/orders/new.js
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { ArrowLeft, Plus, Minus, Save } from 'lucide-react'

export default function NewOrder() {
  const router = useRouter()
  const [items, setItems] = useState([])
  const [selectedItems, setSelectedItems] = useState([{ itemCode: '', quantity: 1 }])
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchItems()
  }, [])

  const fetchItems = async () => {
    try {
      const token = localStorage.getItem('token')
      const res = await fetch('/api/restaurant/items', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setItems(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      // Validacija
      if (selectedItems.some(item => !item.itemCode || item.quantity <= 0)) {
        throw new Error('Sva polja su obavezna i količina mora biti veća od 0')
      }

      const token = localStorage.getItem('token')
      const res = await fetch('/api/restaurant/orders', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          items: selectedItems,
          notes
        })
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error)

      router.push('/restaurant/dashboard')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const addItem = () => {
    setSelectedItems([...selectedItems, { itemCode: '', quantity: 1 }])
  }

  const removeItem = (index) => {
    if (selectedItems.length > 1) {
      setSelectedItems(selectedItems.filter((_, i) => i !== index))
    }
  }

  const updateItem = (index, field, value) => {
    const newItems = [...selectedItems]
    newItems[index] = {
      ...newItems[index],
      [field]: value
    }
    setSelectedItems(newItems)
  }

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Učitavanje...</div>
  }

  return (
    <div className="min-h-screen bg-gray-100 py-6">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <button
            onClick={() => router.back()}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Nazad
          </button>
        </div>

        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Novo trebovanje
            </h3>
          </div>

          <form onSubmit={handleSubmit} className="px-4 py-5 sm:p-6">
            <div className="space-y-6">
              {selectedItems.map((selectedItem, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700">
                      Artikal
                    </label>
                    <select
                      value={selectedItem.itemCode}
                      onChange={(e) => updateItem(index, 'itemCode', e.target.value)}
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                    >
                      <option value="">Izaberite artikal</option>
                      {items.map((item) => (
                        <option key={item.code} value={item.code}>
                          {item.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="w-32">
                    <label className="block text-sm font-medium text-gray-700">
                      Količina
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={selectedItem.quantity}
                      onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value, 10))}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => removeItem(index)}
                    className="mt-6 p-2 text-red-600 hover:text-red-800"
                  >
                    <Minus className="h-5 w-5" />
                  </button>
                </div>
              ))}

              <button
                type="button"
                onClick={addItem}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                <Plus className="h-4 w-4 mr-2" />
                Dodaj stavku
              </button>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Napomene
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>

            {error && (
              <div className="mt-4 text-red-600 text-sm">
                {error}
              </div>
            )}

            <div className="mt-6 flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Save className="h-4 w-4 mr-2" />
                Sačuvaj trebovanje
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
