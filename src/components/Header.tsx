import React, { ReactNode } from 'react'
import { Text, View } from 'react-native'
import { COLORS } from '../constants/styles'

export default function Header({ title = "", children }: { title: string, children?: ReactNode }) {
    return (
        <View style={{ width: '100%' }} className='flex flex-row items-center justify-between border-white py-4'>
            <Text style={{ color: COLORS.TEXT_PRIMARY }} className='text-3xl font-extrabold'>
                {title}
            </Text>
            <View>
                {children}
            </View>
        </View>
    )
}