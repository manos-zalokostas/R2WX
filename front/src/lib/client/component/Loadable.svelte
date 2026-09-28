<script>
    import {ui} from "$store";
</script>

<div class={`r2wx-load-wrap ${$ui.isLoading ? 'active' : '' }`}>

    <div class="spinner"></div>

</div>


<style >

  .r2wx-load-wrap {
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
    width: 100vw;
    background: rgba(50, 50, 50, .5);
    display: none;

    &.active {
      display: block;
    }

  }

  .content {
    text-align: center;
    display: block;
  }

  .spinner {
    position: absolute;
    left: calc(50% - 60px);
    top: calc(50% - 80px);
    z-index: 1;
    border-radius: 50%;
    border-color: white;
    -webkit-animation: spin 2s linear infinite;
    animation: spin 2s linear infinite;
    height: 120px;
    width: 120px;
  }

  @-webkit-keyframes spin {
    0% {
      -webkit-transform: rotate(0deg);
    }
    25%{
      border-top: 15px solid;
    }
    50%{
      border-right: 15px solid;
    }
    75%{
      border-bottom: 15px solid;
    }
    100% {
      -webkit-transform: rotate(360deg);
    }
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
      border-width: 4px;
    }
    25%{
      border-width: 18px;
      border-style: groove;
    }
    50%{
      border-width: 4px;
      transform: rotate(360deg);
    }
    75%{
      border-width: 36px;
      border-style: dotted;
    }
    100% {
      border-style: solid;
      border-width: 2px;
      transform: rotate(calc(3 * 360deg));
    }
  }

  /* Add animation to "page content" */
  .content {
    position: relative;
    -webkit-animation-name: animatebottom;
    -webkit-animation-duration: 1s;
    animation-name: animatebottom;
    animation-duration: 1s
  }

  @-webkit-keyframes animatebottom {
    from {
      bottom: -100px;
      opacity: 0
    }
    to {
      bottom: 0px;
      opacity: 1
    }
  }

  @keyframes animatebottom {
    from {
      bottom: -100px;
      opacity: 0
    }
    to {
      bottom: 0;
      opacity: 1
    }
  }


</style>



