import { View, Text } from 'react-native'
import React, { ReactNode } from 'react'
import { COLORS } from '../constants/styles'

export default function Header({ title = "", children }: { title: string, children?: ReactNode }) {
    return (
        <View className='flex flex-row items-center justify-between sticky top-0  border-white py-4'>
            <Text style={{ color: COLORS.TEXT_PRIMARY }} className='text-3xl font-extrabold'>
                {title}
            </Text>
            <View>
                {children}
            </View>
        </View>
    )
}