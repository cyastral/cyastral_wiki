// src/components/layout/navbar.stories.tsx

import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import NewNavBar from './NewNavBar';


const meta: Meta<typeof NewNavBar> = {

  title: 'Layout/Navbar', 
  component: NewNavBar, 
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;

// 定义故事的类型
type Story = StoryObj<typeof meta>;

// 导出一个对象，这就是一个“故事”
// 我们把它命名为 Default，代表 Navbar 的默认状态
export const Default: Story = {};