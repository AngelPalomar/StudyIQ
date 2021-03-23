import React from 'react'
import firebase from '../../database/firebase'

export const query = async (coleccion, field, op, value) => {
    let list = []

    try {
        const doc = await firebase.db.collection(coleccion)
            .where(field, op, value)
            .get().then((query => {
                query.forEach(doc => {
                    list.push(doc.data())
                })
            }))

        return list

    } catch (error) {
        return error
    }
}

/* export function query(coleccion, field, op, value) {
    let list = [];
    try {
        const execQuery = () => {
            const doc = firebase.db.collection(coleccion).where(field, op, value)
                .get().then((query => {
                    query.forEach(doc => {
                        list.push({...doc.data()})
                    })
                }))

                return list
        }
        //Ejecuto función
       console.log(execQuery())
        //Retorno la lista
        console.log(list)
    } catch {
        console.log('perocomo ze')
        return null;
    }
} */