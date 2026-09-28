<script>

    const COLOR = 'tomato'
    let {icon = () => "", color = COLOR, attrs = {}} = $props();

</script>

{@html icon({color, ...attrs})}