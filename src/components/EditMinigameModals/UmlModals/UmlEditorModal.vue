<template>
  <b-modal
  :title="props.modalTitle"
  size="xl"
  v-model="showModal"
  @cancel="hideModalCancel"
  @ok="hideModalOk"
  @hidden="resetModal"
  >
    <!-- uml -->
    <div class="uml-wrapper" style="position: relative">
      <div class="uml-container">
        <div ref="paletteContainer" class="palette">

          <div class="palette-group">
            <div class="palette-title">Objects</div>
            <div class="palette-item" data-type="class" draggable="true" :style="{ backgroundColor: classColors.class }">
              Class
            </div>
            <div class="palette-item" data-type="interface" draggable="true"
                 :style="{ backgroundColor: classColors.interface }">
              Interface
            </div>
            <div class="palette-item" data-type="abstract" draggable="true"
                 :style="{ backgroundColor: classColors.abstract }">
              Abstract
            </div>
            <div class="palette-item" data-type="enum" draggable="true" :style="{ backgroundColor: classColors.enum }">
              Enum
            </div>

            <div class="palette-item" data-type="circle" draggable="true"
                 :style="{ backgroundColor: classColors.circle }">
              Circle
            </div>
          </div>

          <div class="palette-group">
            <div class="palette-title">Relations</div>
            <div class="palette-item" data-type="dependency" draggable="true">⇢ </div>
            <div class="palette-item" data-type="association" draggable="true">→</div>
            <div class="palette-item" data-type="aggregation" draggable="true">◇</div>
            <div class="palette-item" data-type="composition" draggable="true">◆</div>
            <div class="palette-item" data-type="generalization" draggable="true">△</div>
          </div>
        </div>
        <div ref="paperContainer" class="paper-container"></div>
        <div class="right" v-if="selectedElement">
          <b-button size="sm" variant="warning" @click="deleteAllRelations">
            Delete All Relations
          </b-button>

          <b-button size="sm" variant="danger" @click="deleteSelectedElement">
            Delete Object
          </b-button>
          <b-label class="label">
            Classname:
            <b-form-input v-model="labelText" @input="updateLabel" />
          </b-label>
          <label class="label">
            Attributes:
            <b-form-textarea v-model="stuff" @input="updateAttributes" />
          </label>
          <label class="label">
            Methods:
            <b-form-textarea v-model="stuff2" @input="updateMethods" />
          </label>
        </div>
        <div class="right" v-if="selectedLink">
          <b-button size="sm" variant="danger" @click="deleteRelation">
            Delete Relation
          </b-button>
        </div>
      </div>
    </div>

    <!-- uml end -->
    <b-form-group>
      <b-form-textarea v-model="diagramDescription" placeholder="Enter UML-diagram description" rows="4"/>
    </b-form-group>
  </b-modal>
</template>
<script setup lang="ts">
  import { useToast } from "vue-toastification";
  import { dia, shapes, util } from '@joint/core';
  import { onMounted, ref, defineProps, nextTick, defineEmits, watch } from "vue";
  import { BFormInput, BFormTextarea } from "bootstrap-vue-3";
  import { CustRect, InterfaceRect, AbstractRect, EnumRect } from "@/ts/models/links";
  const props = defineProps<{
    modalTitle: string;
    showModal: boolean;
    diagramDescription: string;
    diagramJSON: string;
  }>();

  const emit = defineEmits<{
    (e: "okModal", {json: string, text: string}): void;
    (e: "cancelModal"): void;
  }>();

  const toast = useToast();
  const taskText = ref();
  const showModal = ref(props.showModal);
  const modalTitle = ref(props.modalTitle);
  const diagramDescription = ref(props.diagramDescription);
  const diagramJSON = ref(props.diagramJSON);

  const classColors = {
    class: 'white',
    interface: '#cce5ff',
    abstract: '#ffe6cc',
    circle: 'lightgray',
    enum: '#d3f3d3',
  };
  const namespace = shapes;
  const graph = new dia.Graph({}, { cellNamespace: namespace });
  const paperContainer = ref<HTMLElement | null>(null);
  const paletteContainer = ref<HTMLElement | null>(null);
  const selectedElement = ref<dia.Element | null>(null);
  const selectedLink = ref<dia.Link | null>(null);
  const labelText = ref('');
  const stuff = ref('');
  const stuff2 = ref('');
  const deleteButtonPos = ref<{ x: number; y: number } | null>(null);
  let currentLinkType = ref<'dependency' | 'association' | 'aggregation' | 'composition' | 'generalization' | null>(null);
  type LinkType = "dependency" | "association" | "aggregation" | "composition" | "generalization";

  watch(
    () => props.showModal,
    (newBoolean) => {
      showModal.value = newBoolean;
    },
    { deep: true }
  );

  watch(
    () => props.modalTitle,
    (newModalTitle) => {
      modalTitle.value = newModalTitle;
    },
    { deep: true }
  );

  watch(
    () => props.diagramDescription,
    (description) => {
      diagramDescription.value = description;
    },
    { deep: true }
  );

  watch(
    () => props.diagramJSON,
    (json) => {
      diagramJSON.value = json;
    },
    { deep: true }
  );

  function hideModalOk() {
    diagramJSON.value = graph.toJSON();

    console.log("Editor ok");
    emit("okModal", {json:diagramJSON.value, text:diagramDescription.value});
  }

  function hideModalCancel() {
    // TODO
    console.log("Editor cancel");
    emit("cancelModal");
  }

  function resetModal() {
    // TODO
  }

  // uml
  function resetElementStyle(element: dia.Element) {
    const elementType = element.get('type');
    let originalFill: string;
    switch (elementType) {
      case 'InterfaceRect':
        originalFill = '#cce5ff';
        break;
      case 'AbstractRect':
        originalFill = '#ffe6cc';
        break;
      case 'EnumRect':
        originalFill = '#d3f3d3';
        break;
      default:
        originalFill = 'white';
        break;
    }

    element.attr({
      body: {
        stroke: 'black',
        strokeWidth: 2,
        fill: originalFill
      }
    });
  }

  function isLinkType(type: string): type is LinkType {
    return ["dependency", "association", "aggregation", "composition", "generalization"].includes(type);
  }

  function handleLinkClick(linkView: dia.LinkView) {
    selectedLink.value = linkView.model;
    selectedElement.value = null;
  }

  function deleteRelation() {
    if (selectedLink.value) {
      selectedLink.value.remove();
      selectedLink.value = null;
    }
  }

  function handleElementClick(elementView: dia.ElementView) {
    const clickedElement = elementView.model;

    if (selectedElement.value && selectedElement.value.id !== clickedElement.id) {
      resetElementStyle(selectedElement.value as dia.Element);
    }

    selectedElement.value = clickedElement;

    labelText.value = clickedElement.attr('label/text');
    stuff.value = clickedElement.attr('secondaryLabel/text');
    stuff2.value = clickedElement.attr('thirdLabel/text');
    selectedLink.value = null;

    clickedElement.attr('body/stroke', '#f1c40f');
    clickedElement.attr('body/fill', 'rgba(241, 196, 15, 0.3)');
  }

  function updateLabel() {
    if (selectedElement.value) {
      selectedElement.value.attr('label/text', labelText.value);
    }
  }

  function deleteSelectedElement() {
    if (selectedElement.value) {
      selectedElement.value.remove();
      selectedElement.value = null;
      deleteButtonPos.value = null;
    }
  }

  function adjustElementHeight() {
    if (!selectedElement.value) return;

    const attrLines = stuff.value.split('\n').length;
    const methodLines = stuff2.value.split('\n').length;

    const extraHeightPerLine = 15;
    const totalHeight = 30 + attrLines * extraHeightPerLine + methodLines * extraHeightPerLine;

    selectedElement.value.resize(100, totalHeight);

    selectedElement.value.attr('line1/y1', 25);
    selectedElement.value.attr('line1/y2', 25);
    selectedElement.value.attr('line2/y1', 25 + attrLines * extraHeightPerLine);
    selectedElement.value.attr('line2/y2', 25 + attrLines * extraHeightPerLine);
    selectedElement.value.attr('label/y', 12);
    selectedElement.value.attr('secondaryLabel/y', 25 + attrLines * extraHeightPerLine / 2);
    selectedElement.value.attr('thirdLabel/y', 25 + attrLines * extraHeightPerLine + methodLines * extraHeightPerLine / 2);
  }

  function updateAttributes() {
    if (selectedElement.value) {
      selectedElement.value.attr('secondaryLabel/text', stuff.value);
      adjustElementHeight();
    }
  }

  function updateMethods() {
    if (selectedElement.value) {
      selectedElement.value.attr('thirdLabel/text', stuff2.value);
      adjustElementHeight();
    }
  }

  function deleteAllRelations() {
    if (!selectedElement.value) return;
    const links = graph.getConnectedLinks(selectedElement.value as unknown as dia.Cell);
    links.forEach(link => {
      link.remove();
    });
  }

  let linkSourceElement: dia.Element | null = null;
  let link: dia.Link | null = null;
  let isDependencyMode = ref(false);
  let hoveredElement: dia.Element | null = null;
  let paper: dia.Paper;

  onMounted(() => {
    nextTick(() => {
      if (paperContainer.value) {
        paper = new dia.Paper({
          el: paperContainer.value,
          model: graph,
          width: 700,
          height: 600,
          background: { color: '#F5F5F5' },
          cellViewNamespace: namespace
        });

        paper.on('element:pointerclick', (elementView) => {
          handleElementClick(elementView);
        });

        paper.on('element:mouseenter', (elementView) => {
          if (!isDependencyMode.value) {
            elementView.model.attr('body/stroke', 'blue');
          }
        });
        paper.on('element:mouseleave', (elementView) => {
          if (!isDependencyMode.value) {
            elementView.model.attr('body/stroke', 'black');
          }
        });

        if (paletteContainer.value) {
          paletteContainer.value.querySelectorAll('.palette-item').forEach((item) => {
            item.addEventListener('dragstart', (event) => {
              (event as DragEvent).dataTransfer?.setData('type', item.getAttribute('data-type') || '');
            });
          });
        }

        paper.on('link:pointerclick', (linkView) => {
          handleLinkClick(linkView);
        });

        paperContainer.value.addEventListener('dragover', (event) => {
          event.preventDefault();
        });

        const updateLinkTarget = (event: MouseEvent) => {
          if (isDependencyMode.value && link) {
            const paperPoint = paper.pageToLocalPoint({ x: event.clientX, y: event.clientY });
            link.target({ x: paperPoint.x, y: paperPoint.y });

            const elementViews = paper.findViewsFromPoint(paperPoint);
            const candidate = elementViews.find(view => view.model.isElement())?.model;
            if (candidate) {
              if (hoveredElement && hoveredElement.id !== candidate.id) {
                hoveredElement.attr('body/stroke', 'black');
              }
              candidate.attr('body/stroke', 'blue');
              hoveredElement = candidate;
            } else {
              if (hoveredElement) {
                hoveredElement.attr('body/stroke', 'black');
                hoveredElement = null;
              }
            }
          }
        };

        const finalizeLink = (event: MouseEvent) => {
          if (isDependencyMode.value && link) {
            const paperPoint = paper.pageToLocalPoint({ x: event.clientX, y: event.clientY });
            const elementViews = paper.findViewsFromPoint(paperPoint);
            const targetElementView = elementViews.find(view => view.model.isElement());

            if (targetElementView) {
              link.target(targetElementView.model);
              targetElementView.model.attr('body/stroke', 'blue');
              setTimeout(() => {
                targetElementView.model.attr('body/stroke', 'black');
              }, 2000);
            } else {
              link.remove();
            }

            isDependencyMode.value = false;
            currentLinkType.value = null;
            linkSourceElement = null;
            link = null;

            if (hoveredElement) {
              hoveredElement.attr('body/stroke', 'black');
              hoveredElement = null;
            }
            paperContainer.value?.removeEventListener('mousemove', updateLinkTarget);
            paperContainer.value?.removeEventListener('mouseup', finalizeLink);
          }
        };

        paperContainer.value.addEventListener('drop', (event) => {
          event.preventDefault();
          const rawType = (event as DragEvent).dataTransfer?.getData('type') ?? '';
          const position = paper.pageToLocalPoint({ x: event.clientX, y: event.clientY });
          const elementViews = paper.findViewsFromPoint(position);
          const targetElement = elementViews.find(view => view.model.isElement());

          if (isLinkType(rawType)) {
            if (targetElement) {
              linkSourceElement = targetElement.model;
              isDependencyMode.value = true;
              currentLinkType.value = rawType;
              link = new shapes.standard.Link({
                source: { id: linkSourceElement.id },
                target: { x: position.x, y: position.y }
              });

              switch (currentLinkType.value) {
                case 'dependency':
                  link.attr({
                    line: {
                      strokeWidth: 2,
                      stroke: 'black',
                      strokeDasharray: '5,5',
                      targetMarker: {
                        type: 'path',
                        d: 'M 10 -5 0 0 10 5 z',
                        fill: 'white',
                        stroke: 'black'
                      }
                    }
                  });
                  break;
                case 'association':
                  link.attr({
                    line: {
                      strokeWidth: 2,
                      stroke: 'black',
                      targetMarker: undefined
                    }
                  });
                  break;
                case 'aggregation':
                  link.attr({
                    line: {
                      strokeWidth: 2,
                      stroke: 'black',
                      targetMarker: {
                        type: 'path',
                        d: 'M 20 0 L 10 5 L 0 0 L 10 -5 Z',
                        fill: 'white',
                        stroke: 'black'
                      }
                    }
                  });
                  break;
                case 'composition':
                  link.attr({
                    line: {
                      strokeWidth: 2,
                      stroke: 'black',
                      targetMarker: {
                        type: 'path',
                        d: 'M 20 0 L 10 5 L 0 0 L 10 -5 Z',
                        fill: 'black',
                        stroke: 'black'
                      }
                    }
                  });
                  break;
                case 'generalization':
                  link.attr({
                    line: {
                      strokeWidth: 2,
                      stroke: 'black',
                      targetMarker: {
                        type: 'path',
                        d: 'M 10 -5 0 0 10 5 z',
                        fill: 'white',
                        stroke: 'black'
                      }
                    }
                  });
                  break;
              }

              graph.addCell(link);
              console.log(`Relation '${rawType}' gestartet mit`, linkSourceElement);

              paperContainer.value?.addEventListener('mousemove', updateLinkTarget);
              paperContainer.value?.addEventListener('mouseup', finalizeLink);
            } else {
              console.log(`Relation '${rawType}' gezogen, aber kein Startobjekt getroffen.`);
            }
          } else {
            let element;
            if (rawType === 'class') {
              element = new CustRect({ position });
            } else if (rawType === 'interface') {
              element = new InterfaceRect({ position });
            } else if (rawType === 'abstract') {
              element = new AbstractRect({ position });
            } else if (rawType === 'circle') {
              element = new shapes.standard.Circle({
                position,
                size: { width: 50, height: 50 },
                attrs: { label: { text: 'Circle' } }
              });
            } else if (rawType === 'enum') {
              element = new EnumRect({ position });
            }

            if (element) {
              graph.addCell(element);
            }
          }
        });
      }
    });
  });

</script>
<style scoped>
.uml-container {
  display: flex;
  gap: 20px;
}

.uml-wrapper {
  position: relative;
}

.palette {
  width: 150px;
  background: rgb(226, 220, 201);
  padding: 10px;
  border-radius: 5px;
}

.palette-item {
  padding: 10px;
  margin-bottom: 5px;
  background: #f3f0f0;
  text-align: center;
  cursor: grab;
  border: 1px solid #aaa;
  color: black;
}

.palette-group {
  margin-bottom: 20px;
}

.palette-title {
  font-weight: bold;
  font-size: 14px;
  margin-bottom: 8px;
  color: #333;
  text-transform: uppercase;
}


.paper-container {
  width: 400px;
  height: 400px;
  border: 2px solid rgb(226, 220, 201);
  background: #f5f5f5;
}

.delete-button {
  background-color: rgb(208, 50, 50);
  color: white;
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 10px;
  margin-bottom: 10px;
}

.right {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.label {
  color: black;
}

.selected {
  stroke: #ff6600 !important;
  stroke-width: 3;
  filter: drop-shadow(0px 0px 5px rgba(255, 102, 0, 0.7));
}

.highlight {
  fill: rgba(255, 102, 0, 0.2) !important;
  stroke: #ff6600 !important;
  stroke-width: 3;
}

.highlight-hover {
  stroke: #ff6600;
  stroke-width: 2;
  fill: rgba(255, 102, 0, 0.1);
}
</style>