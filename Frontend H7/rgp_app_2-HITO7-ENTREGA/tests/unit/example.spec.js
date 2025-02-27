import { mount } from '@vue/test-utils'
import Home from '@/views/Home.vue'

describe('HelloWorld.vue', () => {
  it('render component', () => {
    const wrapper = mount(Home)

    expect(wrapper.exists()).toBe(true)
  })
})
