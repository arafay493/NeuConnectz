import { customStyles } from '@/styles/custom-theme'
import { Box, Center, Loader } from '@mantine/core'
import React from 'react'

const LoaderComponent = () => {
    return (
        <Box
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                width: '100vw',
                height: '100vh',
                backgroundColor: 'rgba(255, 255, 255, 0.3)',
                backdropFilter: 'blur(2px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 2000
            }}
        >
            <Center>
                <Loader
                    size="lg"
                    color={customStyles.colors._1B59F8}
                />
            </Center>
        </Box>
    )
}

export default LoaderComponent