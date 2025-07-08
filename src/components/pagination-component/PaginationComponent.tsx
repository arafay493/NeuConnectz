'use client';

import { Badge, Button, Group, Text } from '@mantine/core';
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react'
import { memo } from 'react';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    maxVisiblePages?: number;
}

const PaginationComponent = ({
    currentPage,
    totalPages,
    onPageChange,
    maxVisiblePages = 5
}: PaginationProps) => {
    const getVisiblePages = () => {
        const pages: (number | string)[] = [];

        if (totalPages <= maxVisiblePages) {
            // Show all pages if total is less than max visible
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            // Always show first page
            pages.push(1);

            // Calculate start and end of middle range
            let start = Math.max(2, currentPage - 1);
            let end = Math.min(totalPages - 1, currentPage + 1);

            // Adjust range if current page is near the beginning
            if (currentPage <= 3) {
                start = 2;
                end = maxVisiblePages - 1;
            }

            // Adjust range if current page is near the end
            if (currentPage >= totalPages - 2) {
                start = totalPages - (maxVisiblePages - 2);
                end = totalPages - 1;
            }

            // Add ellipsis before middle range if needed
            if (start > 2) {
                pages.push('...');
            }

            // Add middle range pages
            for (let i = start; i <= end; i++) {
                pages.push(i);
            }

            // Add ellipsis after middle range if needed
            if (end < totalPages - 1) {
                pages.push('...');
            }

            // Always show last page (if not already included)
            if (totalPages > 1) {
                pages.push(totalPages);
            }
        }

        return pages;
    };

    const handlePrevious = () => {
        if (currentPage > 1) {
            onPageChange(currentPage - 1);
        }
    };

    const handleNext = () => {
        if (currentPage < totalPages) {
            onPageChange(currentPage + 1);
        }
    };

    const handlePageClick = (page: number | string) => {
        if (typeof page === 'number') {
            onPageChange(page);
        }
    };

    const visiblePages = getVisiblePages();

    return (
        <Group mt={16} justify="center" gap="xs">
            {/* Previous Button */}
            <Button
                variant="transparent"
                color="blue"
                size="sm"
                onClick={handlePrevious}
                disabled={currentPage === 1}
            >
                <Badge
                    w="100%"
                    variant='light'
                    radius='sm'
                    size='lg'
                    leftSection={<IconChevronLeft size={16} />}
                >
                    Previous
                </Badge>
            </Button>

            {/* Page Numbers */}
            {visiblePages.map((page, index) => (
                <div key={index}>
                    {typeof page === 'string' ? (
                        <Text
                            size="sm"
                            c="gray.6"
                            style={{
                                padding: '8px 12px',
                                minWidth: '40px',
                                textAlign: 'center'
                            }}
                        >
                            {page}
                        </Text>
                    ) : (
                        <Button
                            variant="transparent"
                            size="lg"
                            onClick={() => handlePageClick(page)}
                            p={6}
                        >
                            <Badge
                                variant='light'
                                color={currentPage === page ? 'blue' : 'gray'}
                                size='lg'
                                radius='sm'
                            >
                                {page}
                            </Badge>
                        </Button>
                    )}
                </div>
            ))}

            {/* Next Button */}
            <Button
                variant="transparent"
                color="blue"
                size="sm"
                onClick={handleNext}
                disabled={currentPage === totalPages}
            >
                <Badge
                    variant='light'
                    radius='sm'
                    size='lg'
                    rightSection={<IconChevronRight size={16} />}
                >
                    Next
                </Badge>
            </Button>
        </Group>
    );
};

export default memo(PaginationComponent);
